"use client";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function PiFinanceForm({ data, setData, onNext }) {
  const currencyOptions = ["USD", "CNY"];
  const vendorOptions = [
    "JIANGXI PROVINCE FLYER IM & EX CO. LTD",
    "WUXI TENGHUI ELECTRIC VEHICLES CO.,LTD",
    "WUXI FLYER TECHNOLYGE CO.Ltd",
    "WUXI TIANKANG Electrical Technology Co. ,LTD",
    "BALING MOTORCYCLE(WUXI) CO.,LTD.",
    "ZHEJIANG CHAOWEI IMPORT AND EXPORT CO., LTD",
    "GABRIEL (SUZHOU)IMPORT ANDEXPORTTRADECO,. LTD",
    "WUXI KEYWAY EV CO.,LTD.",
    "WUXI SINYO WING MOTORCYCLE CO.,LTD"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        [name]: value,
      },
    }));
  };

  const { shipping } = data;

  const handleSubmit = (e) => {
    e.preventDefault();
    // if (!shipping.piNumber) {
    //   toast.error("PI Number is required");
    //   return;
    // }
    if (!currencyOptions.includes(shipping.financeRate)) {
      toast.error("Invalid currency rate");
      return;
    }
    if (!vendorOptions.includes(shipping.shippingVendor)) {
      toast.error("Invalid vendor");
      return;
    }
    onNext(); // Proceed to next form
  };

  return (
    <div className="bg-orange-50 py-6 px-3 min-h-screen flex items-center justify-center">
      <Toaster position="top-right" reverseOrder={false} />
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
      >
        <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
          Freight Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* <Input
            label="PI Number"
            name="piNumber"
            value={shipping.piNumber || ""}
            onChange={handleChange}
            required
          /> */}

          <Input
            type="date"
            label="Date"
            name="financeDate"
            value={shipping.financeDate || ""}
            onChange={handleChange}
          />

          <SelectInput
            label="Currency"
            name="financeRate"
            value={shipping.financeRate || ""}
            options={currencyOptions.map((c) => ({ value: c, label: c }))}
            onChange={handleChange}
            required
          />

          <SelectInput
            label="Vendor"
            name="shippingVendor"
            value={shipping.shippingVendor || ""}
            options={vendorOptions.map((v) => ({ value: v, label: v }))}
            onChange={handleChange}
            required
          />

          <Input
            label="Amount"
            name="amount"
            type="number"
            value={shipping.amount || ""}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Next
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
        className="border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
      />
    </div>
  );
}

function SelectInput({
  label,
  name,
  value,
  options,
  onChange,
  required = false,
}) {
  return (
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="border border-orange-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
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
