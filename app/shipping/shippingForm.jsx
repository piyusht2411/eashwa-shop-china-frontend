"use client";
export default function ShippingForm({ data, setData, onSubmit }) {
  const { shipping } = data;

  const handleChange = async (e) => {
    const { name, value, files } = e.target;

    if ((name === "billOfLadingAttachment" || name === "invoiceAttachment") && files?.[0]) {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const token = localStorage.getItem("token");

      try {
        const res = await fetch("https://eashwa-china-backend.vercel.app/api/file/upload-pdf/", {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();
        setData((prev) => ({
          ...prev,
          shipping: { ...prev.shipping, [name]: result.url || "" },
        }));
      } catch {
        alert("File upload failed");
      }
    } else {
      setData((prev) => ({
        ...prev,
        shipping: { ...prev.shipping, [name]: value },
      }));
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="bg-white w-full max-w-2xl rounded-2xl shadow-xl p-8 border-2 border-orange-400"
    >
      <h2 className="text-2xl font-bold mb-6 text-orange-600 text-center">
        Arrival Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="PI Number" name="piNumber" value={shipping.piNumber} onChange={handleChange} required />
        <Input label="Bill of Lading No." name="billOfLadingNo" value={shipping.billOfLadingNo} onChange={handleChange} />
        <Input label="Invoice No." name="invoiceNo" value={shipping.invoiceNo} onChange={handleChange} />
        <Input label="Vessel No." name="vesselNo" value={shipping.vesselNo} onChange={handleChange} />
        <Input label="Ship No." name="shipNo" value={shipping.shipNo} onChange={handleChange} />
        <Input label="Container No." name="containerNo" value={shipping.containerNo} onChange={handleChange} />
        <Input label="ETA" name="eta" type="date" value={shipping.eta} onChange={handleChange} />
        <FileInput label="Bill of Lading Attachment" name="billOfLadingAttachment" fileUrl={shipping.billOfLadingAttachment} onChange={handleChange} />
        <FileInput label="Invoice Attachment" name="invoiceAttachment" fileUrl={shipping.invoiceAttachment} onChange={handleChange} />
      </div>

      <button
        type="submit"
        className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Submit
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

function FileInput({ label, name, onChange, fileUrl }) {
  return (
    <div className="flex flex-col col-span-full">
      <label className="mb-1 font-medium text-orange-700">{label}</label>
      <div className="flex items-center space-x-4">
        <label
          htmlFor={`${name}-input`}
          className="bg-orange-200 text-orange-700 font-semibold py-2 px-4 rounded-lg cursor-pointer hover:bg-orange-300 transition"
        >
          Choose File
        </label>
        <input
          id={`${name}-input`}
          type="file"
          name={name}
          onChange={onChange}
          className="hidden"
          accept="application/pdf"
        />
        <span className="text-gray-500">
          {fileUrl ? fileUrl.split("/").pop() : "No file chosen"}
        </span>
      </div>
    </div>
  );
}
