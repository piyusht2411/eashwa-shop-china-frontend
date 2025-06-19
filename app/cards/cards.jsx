"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import FileImage from "@/assets/png/file.png";
import FileImage2 from "@/assets/png/file2.png";
import FileImage3 from "@/assets/png/file3.png";
import FileImage4 from "@/assets/png/file4.png";
import FileImage5 from "@/assets/png/file5.png";

const Cards = () => {
  const router = useRouter();

  const forms = [
    {
      name: "PI Number",
      image: FileImage,
      link: "/pi-form",
      hoverBg: "hover:bg-orange-100",
      textColor: "text-orange-800",
    },
    {
      name: "Shipping Order-Freight Details",
      image: FileImage3,
      link: "/shipping",
      hoverBg: "hover:bg-blue-100",
      textColor: "text-blue-800",
    },
    
    {
      name: "IGM Details",
      image: FileImage5,
      link: "/clearance",
      hoverBg: "hover:bg-red-300",
      textColor: "text-red-800",
    },
    {
      name: "Transportation",
      image: FileImage2,
      link: "/transport",
      hoverBg: "hover:bg-cyan-100",
      textColor: "text-cyan-800",
    },
  ];

  return (
    <section className="py-12 px-6 bg-orange-50 min-h-screen">
      <div className="max-w-7xl mx-auto text-center mb-10">
        <h2 className="text-4xl font-bold text-orange-800">Choose a Form</h2>
        <p className="text-orange-600 mt-2">Click on a form to begin</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {forms.map((form, index) => (
          <div
            key={index}
            onClick={() => router.push(form.link)}
            className={`cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl ${form.hoverBg} hover:scale-105 transform transition duration-300`}
          >
            <div className="relative w-full aspect-[4/3] h-60 flex justify-center items-center">
              <Image
                src={form.image}
                alt={form.name}
                objectFit="cover"
                className="object-cover"
                width={230}
                height={230}
              />
            </div>
            <div className="p-6 text-center">
              <h3 className={`text-2xl font-semibold ${form.textColor}`}>
                {form.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Cards;
