"use client";
import { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import PiFinanceForm from "./piFinanceForm";
import ShippingForm from "./shippingForm";

export default function CombinedFormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    piFinance: {
      // piNumber: "",
      financeDate: "",
      currentUsdRate: "",
      vendor: "",
      amount: "",
    },
    shipping: {
      // piNumber: "",
      billOfLadingNo: "",
      invoiceNo: "",
      vesselNo: "",
      shipNo: "",
      containerNo: "",
      eta: "",
      billOfLadingAttachment: "",
      invoiceAttachment: "",
    },
  });

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const combinedData = {
      ...formData.piFinance,
      ...formData.shipping,
    };

    try {
      const res = await fetch(
        "https://eashwa-china-backend.vercel.app/api/formData/shipping",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(combinedData),
        }
      );

      const responseData = await res.json();
      if (res.ok) {
        setSubmitted(true); // Show success message
        toast.success("Shipping and Finance details submitted successfully!");
        // Reset form data and step
        setFormData({
          piFinance: {
            // piNumber: "",
            financeDate: "",
            currentUsdRate: "",
            vendor: "",
            amount: "",
          },
          shipping: {
            // piNumber: "",
            billOfLadingNo: "",
            invoiceNo: "",
            vesselNo: "",
            shipNo: "",
            containerNo: "",
            eta: "",
            billOfLadingAttachment: "",
            invoiceAttachment: "",
          },
        });
        setStep(1); // Return to first step
      } else {
        const errorMsg =
          responseData?.error ||
          responseData?.message ||
          "Something went wrong. Please try again.";
        toast.error(`Submission failed: ${errorMsg}`);
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("An error occurred during submission");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4 relative">
      <Toaster position="top-right" reverseOrder={false} />

      <Link href="/shipping-details">
        <button className="absolute top-4 right-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition">
          View Shipping Details
        </button>
      </Link>

      {step === 1 ? (
        <PiFinanceForm
          data={formData}
          setData={setFormData}
          onNext={() => setStep(2)}
        />
      ) : (
        <ShippingForm
          data={formData}
          setData={setFormData}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
