"use client";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ShippingForm({ data, setData, onSubmit }) {
  const [isUploading, setIsUploading] = useState(false);
  const { shipping } = data;

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (
      (name === "billOfLadingAttachment" || name === "invoiceAttachment") &&
      files?.[0]
    ) {
      setIsUploading(true);
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch(
          "https://eashwa-china-backend.vercel.app/api/file/upload-pdf/",
          {
            method: "POST",
            body: formData,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error("File upload failed");

        const result = await res.json();
        if (!result.fileUrl || typeof result.fileUrl !== "string") {
          throw new Error("Invalid file URL received");
        }
        setData((prev) => ({
          ...prev,
          shipping: { ...prev.shipping, [name]: result.fileUrl },
        }));
        toast.success(`${name.split("Attachment")[0]} uploaded successfully!`);
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("File upload failed");
        setData((prev) => ({
          ...prev,
          shipping: { ...prev.shipping, [name]: "" },
        }));
      } finally {
        setIsUploading(false);
      }
    } else {
      setData((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [name]: value },
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!shipping.piNumber) {
      toast.error("PI Number is required");
      return;
    }
    onSubmit();
  };

  return (
    <div className="bg-orange-50 py-6 px-3 min-h-screen flex items-center justify-center">
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
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          Arrival Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="PI Number"
            name="piNumber"
            value={shipping.piNumber || ""}
            onChange={handleChange}
            required
          />
          <Input
            label="Bill of Lading No."
            name="billOfLadingNo"
            value={shipping.billOfLadingNo || ""}
            onChange={handleChange}
          />
          <Input
            label="Invoice No."
            name="invoiceNo"
            value={shipping.invoiceNo || ""}
            onChange={handleChange}
          />
          <Input
            label="Vessel No."
            name="vesselNo"
            value={shipping.vesselNo || ""}
            onChange={handleChange}
          />
          <Input
            label="Container No."
            name="containerNo"
            value={shipping.containerNo || ""}
            onChange={handleChange}
          />
          <Input
            label="Expected Time of Arrival"
            name="expectedTimeOfArrival"
            type="date"
            value={shipping.expectedTimeOfArrival || ""}
            onChange={handleChange}
          />
          <FileInput
            label="Bill of Lading Attachment"
            name="billOfLadingAttachment"
            fileUrl={shipping.billOfLadingAttachment || ""}
            onChange={handleChange}
            disabled={isUploading}
          />
          <FileInput
            label="Invoice Attachment"
            name="invoiceAttachment"
            fileUrl={shipping.invoiceAttachment || ""}
            onChange={handleChange}
            disabled={isUploading}
          />
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className={`mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

function Input({ label, name, value, onChange, type = "text", required = false }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
      />
    </div>
  );
}

function FileInput({ label, name, onChange, fileUrl, disabled = false }) {
  return (
    <div className="flex flex-col">
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
        <span className="text-gray-500">
          {fileUrl ? fileUrl.split("/").pop() : "No file chosen"}
        </span>
      </div>
    </div>
  );
}
