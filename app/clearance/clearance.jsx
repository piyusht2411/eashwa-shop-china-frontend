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
    igmAttachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "igmAttachment") {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    for (let key in formData) {
      formPayload.append(key, formData[key]);
    }

    console.log("Form submitted");
    // Example:
    // fetch('/api/upload', {
    //   method: 'POST',
    //   body: formPayload,
    // })
  };

  return (
    <div className="bg-orange-50 py-6 px-3 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm sm:max-w-md bg-white p-5 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-xl sm:text-2xl font-semibold text-center text-orange-600 mb-4">
          Clearance Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          {/* PI Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PI Number
            </label>
            <input
              type="text"
              name="piNumber"
              value={formData.piNumber}
              onChange={handleChange}
              required
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* IGM No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              IGM No
            </label>
            <input
              type="text"
              name="igmNo"
              value={formData.igmNo}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* BOE No */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              BOE No
            </label>
            <input
              type="text"
              name="boeNo"
              value={formData.boeNo}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

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
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>

          {/* USD Rate at Clearance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              USD Rate at Clearance
            </label>
            <input
              type="number"
              name="usdRateAtClearance"
              value={formData.usdRateAtClearance}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

          {/* Clearance Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Clearance Date
            </label>
            <input
              type="date"
              name="clearanceDate"
              value={formData.clearanceDate}
              onChange={handleChange}
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
            />
          </div>

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
              className="w-full px-3 py-1.5 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Clearance;
