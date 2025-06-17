"use client";
import { useState } from "react";

export default function PiForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    date: "",
    vendorName: "",
    pieces: "",
    model: "",
    rate: "",
    advanceAmount: "",
    bankDetails: "",
    attachment: null,
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

  // ✅ Get token from localStorage (ya jahan bhi store kiya ho)
  const token = localStorage.getItem("token"); 

  try {
    const res = await fetch("https://eashwa-china-backend.vercel.app/api/formData/details", {
      method: "POST",
      body: data,
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Send token here
      },
    });

    if (res.ok) {
      alert("PI Details submitted successfully!");
    } else {
      const err = await res.json();
      alert("Submission failed: " + err.message);
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="PI Number" name="piNumber" value={formData.piNumber} onChange={handleChange} required />
          <Input type="date" label="Date" name="date" value={formData.date} onChange={handleChange} />

          <div className="flex flex-col">
            <label className="mb-1 font-medium text-orange-700">Vendor Name</label>
            <select
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500"
              required
            >
              <option value="">Select Vendor</option>
              <option value="JIANGXI PROVINCE FLYER IM & EX CO. LTD">JIANGXI PROVINCE FLYER IM & EX CO. LTD</option>
              <option value="WUXI TENGHUI ELECTRIC VEHICLES CO.,LTD">WUXI TENGHUI ELECTRIC VEHICLES CO.,LTD</option>
              <option value="WUXI FLYER TECHNOLYGE CO.Ltd">WUXI FLYER TECHNOLYGE CO.Ltd</option>
            </select>
          </div>

          <Input label="Pieces" name="pieces" value={formData.pieces} onChange={handleChange} type="number" />
          <Input label="Model" name="model" value={formData.model} onChange={handleChange} />
          <Input label="Rate" name="rate" value={formData.rate} onChange={handleChange} type="number" />
          <Input label="Advance Amount" name="advanceAmount" value={formData.advanceAmount} onChange={handleChange} type="number" />
          <Input label="Bank Details" name="bankDetails" value={formData.bankDetails} onChange={handleChange} />
          
          <div className="flex flex-col col-span-full">
            <label className="mb-1 font-medium text-orange-700">Attachment</label>
            <input
              type="file"
              name="attachment"
              onChange={handleChange}
              className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500"
            />
          </div>
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
