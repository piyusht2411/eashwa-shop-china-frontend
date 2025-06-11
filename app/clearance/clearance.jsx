"use client"
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
    // Add your API logic here
  };
  return (
    <>
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Clearance Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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
            <label className="block font-medium mb-1">{field.label}</label>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={field.name === "piNumber"}
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
    </>
  )
}

export default Clearance
