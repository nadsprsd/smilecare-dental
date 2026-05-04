"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const doctors = [
  {
    name: "Dr. Priya Menon",
    role: "Chief Dentist & Implantologist",
    img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
  },
  {
    name: "Dr. Arjun Nair",
    role: "Orthodontist & Cosmetic Dentist",
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
  },
  {
    name: "Dr. Sreelakshmi R.",
    role: "Pediatric & General Dentist",
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
  },
];

export default function TeamSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold">MEET OUR TEAM</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Expert Dentists
          </h2>
          <p className="text-gray-500 mt-2">
            Dedicated professionals delivering the best dental care
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {doctors.map((doc, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -6 }}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition"
            >
              <div className="relative w-full h-64">
                <Image
                  src={doc.img}
                  alt={doc.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-5 text-center">
                <h3 className="font-semibold text-lg text-gray-900">
                  {doc.name}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {doc.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}