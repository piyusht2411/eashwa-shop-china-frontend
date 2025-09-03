"use client";
import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

export default function PiForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    date: "",
    detailVendor: "",
    pieces: "",
    model: "",
    detailRate: "",
    detailExchangeRate: "",
    detailCurrentRate: "",
    advanceAmount: "",
    runningSerialNumber: "",
    attachment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const resetForm = () => {
    setFormData({
      piNumber: "",
      date: "",
      detailVendor: "",
      pieces: "",
      model: "",
      detailRate: "",
      detailExchangeRate: "",
      detailCurrentRate: "",
      advanceAmount: "",
      runningSerialNumber: "",
      attachment: "",
    });
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment" && files && files[0]) {
      setIsUploading(true);
      const file = files[0];
      const fileData = new FormData();
      fileData.append("file", file);

      const token = localStorage.getItem("token");

      try {
        const uploadRes = await fetch(
          "https://eashwa-china-backend.vercel.app/api/file/upload-pdf/",
          {
            method: "POST",
            body: fileData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!uploadRes.ok) {
          throw new Error("File upload failed");
        }

        const uploadData = await uploadRes.json();
        setFormData((prev) => ({
          ...prev,
          attachment: uploadData.fileUrl || "",
        }));
        toast.success("File uploaded successfully!");
      } catch (error) {
        console.error("File upload error:", error);
        toast.error("Failed to upload file");
        setFormData((prev) => ({
          ...prev,
          attachment: "",
        }));
      } finally {
        setIsUploading(false);
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.piNumber) {
      toast.error("PI Number is required");
      return;
    }

    setIsSubmitting(true);
    const jsonData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== undefined
      )
    );

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://eashwa-china-backend.vercel.app/api/formData/details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jsonData),
        }
      );

      const responseData = await res.json();
      if (res.ok) {
        toast.success("PI Details submitted successfully!");
        resetForm();
      } else {
        const errorMsg =
          responseData?.error ||
          responseData?.message ||
          "Something went wrong. Please try again.";
        toast.error(`Submission failed: ${errorMsg}`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4 relative">
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

      <Link href="/pi-details">
        <button className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          View PI Details
        </button>
      </Link>

      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border-2 border-orange-400 relative"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          PI Details Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="PI Number"
            name="piNumber"
            value={formData.piNumber}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            label="Date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />

          <SelectInput
            label="Vendor"
            name="detailVendor"
            value={formData.detailVendor}
            onChange={handleChange}
            options={[
              "JIANGXI PROVINCE FLYER IM & EX CO. LTD",
              "WUXI TENGHUI ELECTRIC VEHICLES CO.,LTD",
              "WUXI FLYER TECHNOLYGE CO.Ltd",
              "WUXI TIANKANG Electrical Technology Co. ,LTD",
              "BALING MOTORCYCLE(WUXI) CO.,LTD.",
              "ZHEJIANG CHAOWEI IMPORT AND EXPORT CO., LTD",
              "GABRIEL (SUZHOU)IMPORT ANDEXPORTTRADECO,. LTD",
            ]}
          />

          <Input
            label="Pieces"
            name="pieces"
            value={formData.pieces}
            onChange={handleChange}
            type="number"
          />

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-orange-700">
              Exchange Rate
            </label>
            <div className="flex items-center space-x-2">
              <select
                name="detailRate"
                value={formData.detailRate}
                onChange={handleChange}
                className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-24"
              >
                <option value="">Rate</option>
                {["USD", "CNY"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="detailExchangeRate"
                value={formData.detailExchangeRate}
                onChange={handleChange}
                className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-full"
              />
            </div>
          </div>

          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
          />

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-orange-700">
              Rate Per Piece
            </label>
            <div className="flex items-center space-x-2">
              <select
                name="detailRate"
                value={formData.detailRate}
                onChange={handleChange}
                className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-24"
              >
                <option value="">Rate</option>
                {["USD", "CNY"].map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="detailCurrentRate"
                value={formData.detailCurrentRate}
                onChange={handleChange}
                className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-full"
              />
            </div>
          </div>

          <Input
            label="Advance Amount"
            name="advanceAmount"
            value={formData.advanceAmount}
            onChange={handleChange}
            type="number"
          />

          <Input
            label="Running Serial Number"
            name="runningSerialNumber"
            value={formData.runningSerialNumber}
            onChange={handleChange}
          />

          <div className="flex flex-col col-span-full">
            <label className="mb-1 font-medium text-orange-700">
              Attachment
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="attachment-input"
                className={`bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Choose File
              </label>
              <input
                id="attachment-input"
                type="file"
                name="attachment"
                onChange={handleChange}
                className="hidden"
                accept="application/pdf"
                disabled={isUploading}
              />
              <span className="text-gray-500">
                {formData.attachment
                  ? formData.attachment.split("/").pop()
                  : "No file chosen"}
              </span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isUploading}
          className={`mt-6 w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition ${
            isSubmitting || isUploading
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-orange-600"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
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
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-full"
      />
    </div>
  );
}

function SelectInput({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black w-full"
        required
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
