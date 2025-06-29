"use client";
import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function TransportationForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    eWayBillNumber: "",
    amountOfTransport: "",
    finalDestination: "",
    attachedmentEWayBill: "",
    boeNo: "",
    detailRate: "",
    transporationRate: "",
    totalAmout: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "attachedmentEWayBill" && files && files[0]) {
      setIsUploading(true);
      const file = files[0];
      const formFile = new FormData();
      formFile.append("file", file);

      const token = localStorage.getItem("token");

      try {
        const uploadRes = await fetch(
          "https://eashwa-china-backend.vercel.app/api/file/upload-pdf/",
          {
            method: "POST",
            body: formFile,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!uploadRes.ok) throw new Error("File upload failed");

        const uploadData = await uploadRes.json();
        setFormData((prev) => ({
          ...prev,
          attachedmentEWayBill: uploadData.fileUrl || "",
        }));
        toast.success("E-Way Bill PDF uploaded successfully!");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("PDF upload failed");
        setFormData((prev) => ({ ...prev, attachedmentEWayBill: "" }));
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.piNumber) {
      toast.error("PI Number is required");
      return;
    }
    if (formData.detailRate && !["USD", "CNY"].includes(formData.detailRate)) {
      toast.error("Detail Rate must be USD or CNY");
      return;
    }

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://eashwa-china-backend.vercel.app/api/formData/transportation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const result = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Transportation details submitted successfully!");
      } else {
        toast.error(`Submission failed: ${result.message || result.error || "Something went wrong"}`);
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 relative">
      <Toaster position="top-right" reverseOrder={false} />

      {isUploading && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 opacity-75">
          <div className="flex items-center justify-center bg-white rounded-xl p-8">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin border-t-orange-500"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="ml-3 text-orange-600 font-medium">
              Uploading PDF...
            </span>
          </div>
        </div>
      )}

      <Link href="/transportation-details">
        <button className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          View Transportation Details
        </button>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          Transportation Details Form
        </h2>

        {submitted ? (
          <p className="text-green-600 text-center font-semibold">
            ✅ Form submitted successfully!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="PI Number"
                name="piNumber"
                value={formData.piNumber}
                onChange={handleChange}
                required
              />
              <Input
                label="E-Way Bill Number"
                name="eWayBillNumber"
                value={formData.eWayBillNumber}
                onChange={handleChange}
                type="number"
              />
              <Input
                label="Amount of Transport"
                name="amountOfTransport"
                value={formData.amountOfTransport}
                onChange={handleChange}
                type="number"
              />
              <Input
                label="Final Destination"
                name="finalDestination"
                value={formData.finalDestination}
                onChange={handleChange}
              />
              <Input
                label="BOE No."
                name="boeNo"
                value={formData.boeNo}
                onChange={handleChange}
              />
              <SelectInput
                label="Detail Rate"
                name="detailRate"
                value={formData.detailRate}
                options={["USD", "CNY"].map((c) => ({ value: c, label: c }))}
                onChange={handleChange}
              />
              <Input
                label="Transportation Rate"
                name="transporationRate"
                value={formData.transporationRate}
                onChange={handleChange}
                type="number"
              />
              <Input
                label="Total Amount"
                name="totalAmout"
                value={formData.totalAmout}
                onChange={handleChange}
                type="number"
              />
              <FileInput
                label="E-Way Bill PDF"
                name="attachedmentEWayBill"
                onChange={handleChange}
                fileUrl={formData.attachedmentEWayBill}
                disabled={isUploading}
              />
            </div>

            <button
              type="submit"
              disabled={isUploading}
              className={`mt-6 w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition ${
                isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-orange-600"
              }`}
            >
              Submit
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
      />
    </div>
  );
}

function SelectInput({ label, name, value, options, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function FileInput({ label, name, onChange, fileUrl, disabled = false }) {
  return (
    <div className="flex flex-col col-span-full">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor={`${name}-input`}
          className={`bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Choose File
        </label>
        <input
          id={`${name}-input`}
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          accept="application/pdf"
          disabled={disabled}
        />
        <span className="text-sm text-gray-600">
          {fileUrl ? fileUrl.split("/").pop() : "No file chosen"}
        </span>
      </div>
    </div>
  );
}
