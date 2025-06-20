"use client";
import { useState } from "react";

export default function TransportationForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    eWayBillNumber: "",
    amountOfTransport: "",
    finalDestination: "",
    attachedmentEWayBill: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "attachedmentEWayBill" && files && files[0]) {
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
      } catch (err) {
        console.error("Upload error:", err);
        alert("PDF upload failed");
        setFormData((prev) => ({ ...prev, attachedmentEWayBill: "" }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        alert("Transportation details submitted successfully!");
      } else {
        alert("Submission failed: " + (result.message || result.error));
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
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
              <FileInput
                label="E-Way Bill PDF"
                name="attachedmentEWayBill"
                onChange={handleChange}
                fileUrl={formData.attachedmentEWayBill}
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
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

function FileInput({ label, name, onChange, fileUrl }) {
  return (
    <div className="flex flex-col col-span-full">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor={`${name}-input`}
          className="bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition"
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
        />
        <span className="text-sm text-gray-600">
          {fileUrl ? fileUrl.split("/").pop() : "No file chosen"}
        </span>
      </div>
    </div>
  );
}
