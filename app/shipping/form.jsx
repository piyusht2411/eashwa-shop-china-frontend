"use client";
import { useState } from "react";
import PiFinanceForm from "./piFinanceForm";
import ShippingForm from "./shippingForm";

export default function CombinedFormPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    piFinance: {
      piNumber: "",
      financeDate: "",
      currentUsdRate: "",
      vendor: "",
      amount: "",
    },
    shipping: {
      piNumber: "",
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

      if (res.ok) {
        setSubmitted(true); // show success message
      } else {
        const result = await res.json();
        alert("Submission failed: " + (result.error || result.message));
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      {submitted ? (
        <p className="text-green-600 font-semibold text-center text-xl">
          ✅ Shipping and Finance details submitted successfully!
        </p>
      ) : step === 1 ? (
        <PiFinanceForm data={formData} setData={setFormData} onNext={() => setStep(2)} />
      ) : (
        <ShippingForm data={formData} setData={setFormData} onSubmit={handleSubmit} />
      )}
    </div>
  );
}
