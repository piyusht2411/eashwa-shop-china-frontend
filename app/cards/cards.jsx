"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import FileImage from "../../assets/png/file.png";
import FileImage2 from "../../assets/png/file2.png";
import FileImage3 from "../../assets/png/file3.png";
import FileImage4 from "../../assets/png/file4.png";
import FileImage5 from "../../assets/png/file5.png";

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
      name: "BOE Details",
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
    <section className="py-10 px-4 sm:px-6 md:px-10 bg-orange-50 min-h-screen relative">
      {/* Title Section */}
      <div className="max-w-7xl mx-auto text-center mb-6 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-800">
          Choose a Form
        </h2>
        <p className="text-sm sm:text-base text-orange-600 mt-2">
          Click on a form to begin
        </p>
      </div>

      {/* Search Button */}
      <div className="flex justify-end mb-6 lg:mb-0 lg:absolute lg:top-6 lg:right-6 z-10">
        <button
          onClick={() => router.push("/search")}
          className="px-4 py-2 sm:px-6 sm:py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition duration-300 flex items-center gap-2 text-sm sm:text-base"
        >
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          Search
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-7xl mx-auto">
        {forms.map((form, index) => (
          <div
            key={index}
            onClick={() => router.push(form.link)}
            className={`cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl ${form.hoverBg} hover:scale-105 transform transition duration-300`}
          >
            <div className="relative w-full aspect-[4/3] sm:h-52 flex justify-center items-center bg-gray-50">
              <Image
                src={form.image}
                alt={form.name}
                className="object-contain"
                width={200}
                height={200}
              />
            </div>
            <div className="p-4 sm:p-6 text-center">
              <h3 className={`text-lg sm:text-xl md:text-2xl font-semibold ${form.textColor}`}>
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
