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
      name: "Form 1",
      image: FileImage,
      link: "/clearance",
    },
    {
      name: "Form 2",
      image: FileImage3,
      link: "/coming-soon",
    },
    {
      name: "Form 3",
      image: FileImage2,
      link: "/coming-soon",
    },
    {
      name: "Form 4",
      image: FileImage5,
      link: "/coming-soon",
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
            className="cursor-pointer bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:bg-orange-100 hover:scale-105 transform transition duration-300"
          >
            <div className="relative w-full aspect-[4/3] h-60 flex justify-center items-center">
              <Image
                src={form.image}
                alt={form.name}
                // layout="fill"
                objectFit="cover"
                className="object-cover"
                width={230}
                height={230}
              />
            </div>
            <div className="p-6 text-center">
              <h3 className="text-2xl font-semibold text-orange-800">
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
