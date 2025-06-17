"use client";
import { useState } from "react";

export default function ShippingForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    billOfLadingNo: "",
    invoiceNo: "",
    vesselNo: "",
    shipNo: "",
    containerNo: "",
    eta: "",
    billOfLadingAttachment: null,
    invoiceAttachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await fetch("/api/shipping", {
        method: "POST",
        body: data,
      });

      if (res.ok) {
        alert("Shipping details submitted successfully!");
      } else {
        alert("Submission failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          Shipping Details Form
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="PI Number" name="piNumber" value={formData.piNumber} onChange={handleChange} required />
          <Input label="Bill of Lading No." name="billOfLadingNo" value={formData.billOfLadingNo} onChange={handleChange} />
          <Input label="Invoice No." name="invoiceNo" value={formData.invoiceNo} onChange={handleChange} />
          <Input label="Vessel No." name="vesselNo" value={formData.vesselNo} onChange={handleChange} />
          <Input label="Ship No." name="shipNo" value={formData.shipNo} onChange={handleChange} />
          <Input label="Container No." name="containerNo" value={formData.containerNo} onChange={handleChange} />
          <Input label="ETA" name="eta" type="date" value={formData.eta} onChange={handleChange} />

          <FileInput label="Bill of Lading Attachment" name="billOfLadingAttachment" onChange={handleChange} />
          <FileInput label="Invoice Attachment" name="invoiceAttachment" onChange={handleChange} />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Submit
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
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500"
      />
    </div>
  );
}

function FileInput({ label, name, onChange }) {
  return (
    <div className="flex flex-col col-span-full">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <input
        type="file"
        name={name}
        onChange={onChange}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500"
      />
    </div>
  );
}
