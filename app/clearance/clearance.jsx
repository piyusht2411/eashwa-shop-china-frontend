"use client";
import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const Clearance = () => {
  const [formData, setFormData] = useState({
    piNumber: "",
    boeNo: "",
    dutyPaid: "",
    dutyAmout: "",
    usdRateAtClearance: "USD", // Default to USD
    clearanceDate: "",
    igmAttachment: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const resetForm = () => {
    setFormData({
      piNumber: "",
      boeNo: "",
      dutyPaid: "",
      dutyAmout: "",
      usdRateAtClearance: "USD",
      clearanceDate: "",
      igmAttachment: "",
    });
    setSubmitted(false);
  };

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "igmAttachment" && files && files[0]) {
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

        if (!uploadRes.ok) throw new Error("File upload failed");

        const uploadData = await uploadRes.json();
        if (!uploadData.fileUrl || typeof uploadData.fileUrl !== "string") {
          throw new Error("Invalid file URL received");
        }
        setFormData((prev) => ({
          ...prev,
          igmAttachment: uploadData.fileUrl,
        }));
        toast.success("File uploaded successfully!");
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("File upload failed");
        setFormData((prev) => ({
          ...prev,
          igmAttachment: "",
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
    if (!["USD", "CNY"].includes(formData.usdRateAtClearance)) {
      toast.error("Invalid currency rate");
      return;
    }
    if (!formData.dutyPaid || !["true", "false"].includes(formData.dutyPaid)) {
      toast.error("Duty Paid status is required");
      return;
    }

    setIsSubmitting(true);
    const jsonData = {
      ...formData,
      dutyPaid: formData.dutyPaid === "true",
      dutyAmout: formData.dutyAmout ? parseFloat(formData.dutyAmout) : null,
      clearanceDate: formData.clearanceDate
        ? new Date(formData.clearanceDate)
        : null,
    };

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        "https://eashwa-china-backend.vercel.app/api/formData/clearance",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(jsonData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        toast.success("Clearance details submitted successfully!");
        setTimeout(resetForm, 500); // Reset after 3 seconds
      } else {
        toast.error(
          `Submission failed: ${
            data.message || data.error || "Something went wrong"
          }`
        );
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-orange-50 py-6 px-3 min-h-screen flex items-center justify-center relative">
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

      <Link href="/clearance-details">
        <button className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          View BOE Details
        </button>
      </Link>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg border border-orange-200">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          BOE Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="PI Number"
            name="piNumber"
            value={formData.piNumber}
            onChange={handleChange}
            required
          />

          <InputField
            label="BOE No"
            name="boeNo"
            value={formData.boeNo}
            onChange={handleChange}
          />

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">
              Duty Paid
            </label>
            <select
              name="dutyPaid"
              value={formData.dutyPaid}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
            >
              <option value="">Select</option>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <InputField
            label="Duty Amount"
            name="dutyAmout"
            value={formData.dutyAmout}
            onChange={handleChange}
            type="number"
          />

          <div>
            <label className="block text-sm font-medium text-orange-700 mb-1">
              Rate
            </label>
            <select
              name="usdRateAtClearance"
              value={formData.usdRateAtClearance}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
            >
              {["USD", "CNY"].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <InputField
            label="Date"
            name="clearanceDate"
            type="date"
            value={formData.clearanceDate}
            onChange={handleChange}
            required
          />

          <div className="flex flex-col">
            <label className="block text-sm font-medium text-orange-700 mb-1">
              Attachment
            </label>
            <div className="flex items-center space-x-4">
              <label
                htmlFor="igmAttachment-input"
                className={`bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Choose File
              </label>
              <input
                id="igmAttachment-input"
                type="file"
                name="igmAttachment"
                accept="application/pdf"
                onChange={handleChange}
                required={!formData.igmAttachment}
                disabled={isUploading}
                className="hidden"
              />
              <span className="text-gray-500">
                {formData.igmAttachment
                  ? formData.igmAttachment.split("/").pop()
                  : "No file chosen"}
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className={`w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-lg transition ${
              isSubmitting || isUploading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

const InputField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
}) => (
  <div>
    <label className="block text-sm font-medium text-orange-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 border border-orange-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-black"
    />
  </div>
);

export default Clearance;
