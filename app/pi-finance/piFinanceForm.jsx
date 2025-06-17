"use client";
import { useState } from "react";

export default function PiFinanceForm() {
  const [formData, setFormData] = useState({
    piNumber: "",
    financeDate: "",
    currentUsdRate: "",
    vendor: "",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/pifinance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("PI Finance details submitted successfully!");
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
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          PI Finance Form
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
            label="Finance Date"
            name="financeDate"
            value={formData.financeDate}
            onChange={handleChange}
          />
          <Input
            label="Current USD Rate"
            name="currentUsdRate"
            type="number"
            value={formData.currentUsdRate}
            onChange={handleChange}
          />
          <Input
            label="Vendor"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
          />
          <Input
            label="Amount"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
          />
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
