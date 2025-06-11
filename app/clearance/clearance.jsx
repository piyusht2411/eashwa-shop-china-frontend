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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Clearance Form Data:", formData);
    // API logic here
  };

  return (
    <div className="bg-gray-100 py-6 px-3 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-5 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-blue-600 mb-4">
          Clearance Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {[
            { label: "PI Number", name: "piNumber", type: "text" },
            { label: "IGM No", name: "igmNo", type: "text" },
            { label: "BOE No", name: "boeNo", type: "text" },
            { label: "Duty Paid", name: "dutyPaid", type: "number" },
            { label: "USD Rate at Clearance", name: "usdRateAtClearance", type: "number" },
            { label: "Clearance Date", name: "clearanceDate", type: "date" },
            { label: "IGM Attachment URL", name: "igmAttachment", type: "text" },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type={field.type}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                required={field.name === "piNumber"}
                className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Clearance;
