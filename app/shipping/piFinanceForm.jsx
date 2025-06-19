"use client";
import { useState, useEffect } from "react";

export default function PiFinanceForm({ data, setData, onNext }) {
  const currencyOptions = ["USD", "CNY"];
  const vendorOptions = [
    "JIANGXI PROVINCE FLYER IM & EX CO. LTD",
    "WUXI TENGHUI ELECTRIC VEHICLES CO.,LTD",
    "WUXI FLYER TECHNOLYGE CO.Ltd",
    "WUXI TIANKANG Electrical Technology Co. ,LTD",
    "BALING MOTORCYCLE(WUXI) CO.,LTD.",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      piFinance: {
        ...prev.piFinance,
        [name]: value,
      },
    }));
  };

  const { piFinance } = data;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext(); // Go to next form
      }}
      className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
        Freight Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="PI Number"
          name="piNumber"
          value={piFinance.piNumber}
          onChange={handleChange}
          required
          className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
        />

        <Input
          type="date"
          label="Finance Date"
          name="financeDate"
          value={piFinance.financeDate}
          onChange={handleChange}
          className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
        />

        <SelectInput
          label="Currency"
          name="financeRate"
          value={piFinance.financeRate}
          options={currencyOptions.map((c) => ({ value: c, label: c }))}
          onChange={handleChange}
          className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
        />

        <SelectInput
          label="Vendor"
          name="shippingVendor"
          value={piFinance.shippingVendor}
          options={vendorOptions.map((v) => ({ value: v, label: v }))}
          onChange={handleChange}
          className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
        />

        <Input
          label="Amount"
          name="amount"
          type="number"
          value={piFinance.amount}
          onChange={handleChange}
          className="border border-orange-300 rounded px-3 py-2 focus:outline-orange-500 text-black"
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Next
      </button>
    </form>
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

function SelectInput({ label, name, value, options, onChange }) {
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
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
