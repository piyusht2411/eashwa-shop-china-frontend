"use client";
import { useState } from "react";

const Clearance = () => {
  const [formData, setFormData] = useState({
    piNumber: "",
    igmNo: "",
    boeNo: "",
    dutyPaid: "",
    usdRateAtClearance: "",
    clearanceDate: "",
    igmAttachment: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "igmAttachment" && files && files[0]) {
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
        setFormData((prev) => ({
          ...prev,
          igmAttachment: uploadData.fileUrl || "",
        }));
      } catch (error) {
        console.error("Upload error:", error);
        alert("File upload failed");
        setFormData((prev) => ({
          ...prev,
          igmAttachment: "",
        }));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        alert("IGM details submitted successfully!");
      } else {
        alert("Submission failed: " + (data.message || data.error));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="bg-orange-50 py-6 px-3 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-5 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-orange-600 mb-4">
          IGM Details Form
        </h2>

        {submitted ? (
          <div className="text-center text-green-600 font-semibold text-lg py-8">
            🎉 Thank you for submitting!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <InputField
              label="PI Number"
              name="piNumber"
              value={formData.piNumber}
              onChange={handleChange}
              required
            />

            <InputField
              label="IGM No"
              name="igmNo"
              value={formData.igmNo}
              onChange={handleChange}
              required
            />

            <InputField
              label="BOE No"
              name="boeNo"
              value={formData.boeNo}
              onChange={handleChange}
              required
            />

            {/* Duty Paid Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duty Paid
              </label>
              <select
                name="dutyPaid"
                value={formData.dutyPaid}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-black"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>

            {/* Currency Rate Dropdown (USD/CNY) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                USD Rate at Clearance
              </label>
              <select
                name="usdRateAtClearance"
                value={formData.usdRateAtClearance}
                onChange={handleChange}
                required
                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-black"
              >
                <option value="">Select Currency</option>
                <option value="USD">USD</option>
                <option value="CNY">CNY</option>
              </select>
            </div>

            <InputField
              label="Clearance Date"
              name="clearanceDate"
              type="date"
              value={formData.clearanceDate}
              onChange={handleChange}
              required
            />

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                IGM Attachment (PDF)
              </label>
              <input
                type="file"
                name="igmAttachment"
                accept="application/pdf"
                onChange={handleChange}
                required
                className="w-full text-orange-600 file:mr-3 file:py-1.5 file:px-4 file:border file:rounded-md file:border-gray-300 file:text-sm file:bg-orange-100 hover:file:bg-orange-200 cursor-pointer"
              />
              {formData.igmAttachment && (
                <p className="text-xs text-green-700 mt-1">
                  Uploaded: {formData.igmAttachment.split("/").pop()}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        )}
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
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm text-black"
    />
  </div>
);

export default Clearance;
