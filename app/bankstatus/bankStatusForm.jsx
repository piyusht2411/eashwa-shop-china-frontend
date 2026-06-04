"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const bankVendors = [
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

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000099] bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Confirm Action
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 text-left mb-6">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

const BankStatusForm = () => {
  const [formData, setFormData] = useState({
    piNumber: "",
    boeNo: "",
    bankVendor: "",
    status: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "status") {
      setPendingStatus(value);
      setIsModalOpen(true);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleConfirmStatus = () => {
    setFormData((prev) => ({
      ...prev,
      status: pendingStatus,
    }));
    if (errors.status) {
      setErrors((prev) => ({ ...prev, status: "" }));
    }
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPendingStatus("");
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.piNumber.trim()) newErrors.piNumber = "PI Number is required";
    if (!formData.bankVendor)
      newErrors.bankVendor = "Please select a bank vendor";
    if (!formData.status) newErrors.status = "Please select a status";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        "https://eashwa-china-backend.vercel.app/api/formData/bank-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...formData,
            status: formData.status === "Yes",
          }),
        }
      );

      if (response.ok) {
        toast.success("Form submitted successfully!", {
          position: "top-right",
          style: {
            background: "#fff",
            color: "#000000",
            border: "1px solid #ea580c",
            borderRadius: "8px",
          },
        });
        setFormData({ piNumber: "", boeNo: "", bankVendor: "", status: "" });
      } else {
        toast.error("Error submitting form", {
          position: "top-right",
          style: {
            background: "#fff",
            color: "#000000",
            border: "1px solid #dc2626",
            borderRadius: "8px",
          },
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred while submitting the form", {
        position: "top-right",
        style: {
          background: "#fff",
          color: "#000000",
          border: "1px solid #dc2626",
          borderRadius: "8px",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 px-4 py-8 relative">
      <div className="w-full flex justify-center md:justify-end mb-4 md:absolute md:top-6 md:right-6">
        <Link href="/bankdetails">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full sm:w-auto">
            View BANK Details
          </button>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <Toaster />
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">
          Bank Status Form
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="piNumber"
              className="block text-sm font-medium text-orange-700"
            >
              PI Number
            </label>
            <input
              type="text"
              id="piNumber"
              name="piNumber"
              value={formData.piNumber}
              onChange={handleChange}
              placeholder="Enter PI Number"
              className={`mt-1 block w-full p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.piNumber ? "border-red-500" : "border-orange-300"
              }`}
            />
            {errors.piNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.piNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="boeNo"
              className="block text-sm font-medium text-orange-700"
            >
              BOE Number
            </label>
            <input
              type="text"
              id="boeNo"
              name="boeNo"
              value={formData.boeNo}
              onChange={handleChange}
              placeholder="Enter BOE Number (Optional)"
              className="mt-1 block w-full p-2 border text-black border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label
              htmlFor="bankVendor"
              className="block text-sm font-medium text-orange-700"
            >
              Bank Vendor
            </label>
            <select
              id="bankVendor"
              name="bankVendor"
              value={formData.bankVendor}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.bankVendor ? "border-red-500" : "border-orange-300"
              }`}
            >
              <option value="">Select a vendor</option>
              {bankVendors.map((vendor) => (
                <option key={vendor} value={vendor}>
                  {vendor}
                </option>
              ))}
            </select>
            {errors.bankVendor && (
              <p className="mt-1 text-sm text-red-500">{errors.bankVendor}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-orange-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`mt-1 block w-full p-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                errors.status ? "border-red-500" : "border-orange-300"
              }`}
            >
              <option value="">Select status</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-2 px-4 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmStatus}
        message="This action cannot be undone. This will permanently set your status to the selected value. Are you sure you want to continue?"
      />
    </div>
  );
};

export default BankStatusForm;
