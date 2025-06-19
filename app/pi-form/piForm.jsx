"use client";
import { useState } from "react";

export default function PiForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    date: "",
    detailVendor: "",
    pieces: "",
    model: "",
    detailRate: "",
    advanceAmount: "",
    runningSerialNumber: "",
    attachment: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === "attachment" && files && files[0]) {
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
          attachment: uploadData.url || "",
        }));
      } catch (error) {
        console.error("File upload error:", error);
        alert("Failed to upload file");
        setFormData((prev) => ({
          ...prev,
          attachment: "",
        }));
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
      alert("PI Number is required");
      return;
    }

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
        setSubmitted(true);
      } else {
        alert("Submission failed: " + (responseData.error || responseData.message));
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          PI Details Form
        </h2>

        {submitted ? (
          <p className="text-green-600 text-center font-semibold">
            ✅ PI Details submitted successfully!
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="PI Number" name="piNumber" value={formData.piNumber} onChange={handleChange} required />
              <Input type="date" label="Date" name="date" value={formData.date} onChange={handleChange} />

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
                ]}
              />

              <Input label="Pieces" name="pieces" value={formData.pieces} onChange={handleChange} type="number" />
              <Input label="Model" name="model" value={formData.model} onChange={handleChange} />

              <SelectInput
                label="Currency Rate"
                name="detailRate"
                value={formData.detailRate}
                onChange={handleChange}
                options={["USD", "CNY"]}
              />

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

              {/* File Upload */}
              <div className="flex flex-col col-span-full">
                <label className="mb-1 font-medium text-orange-700">Attachment</label>
                <div className="flex items-center space-x-4">
                  <label
                    htmlFor="attachment-input"
                    className="bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition"
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
                  />
                  <span className="text-gray-500">
                    {formData.attachment ? formData.attachment.split("/").pop() : "No file chosen"}
                  </span>
                </div>
              </div>
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
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
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
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
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
