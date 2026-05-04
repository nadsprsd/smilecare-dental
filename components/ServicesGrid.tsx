"use client";

import { motion } from "framer-motion";
import {
  Smile,
  Stethoscope,
  Sparkles,
  Shield,
  HeartPulse,
  Activity,
} from "lucide-react";

const services = [
  {
    title: "Teeth Whitening",
    desc: "Brighten your smile with safe and advanced whitening treatments.",
    price: "From ₹3,000",
    icon: <Sparkles size={28} />,
  },
  {
    title: "Dental Implants",
    desc: "Permanent and natural-looking tooth replacement solutions.",
    price: "From ₹18,000",
    icon: <Shield size={28} />,
  },
  {
    title: "Braces & Aligners",
    desc: "Straighten your teeth with modern invisible aligners.",
    price: "From ₹25,000",
    icon: <Smile size={28} />,
  },
  {
    title: "Root Canal",
    desc: "Pain-free treatment to save your natural tooth.",
    price: "From ₹4,000",
    icon: <Activity size={28} />,
  },
  {
    title: "Pediatric Dentistry",
    desc: "Gentle and friendly care for children.",
    price: "From ₹500",
    icon: <HeartPulse size={28} />,
  },
  {
    title: "Dental Checkup",
    desc: "Complete oral health check with modern diagnostics.",
    price: "₹300 only",
    icon: <Stethoscope size={28} />,
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* TITLE */}
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold">WHAT WE OFFER</p>
          <h2 className="text-3xl font-bold text-gray-900">
            Our Dental Services
          </h2>
          <p className="text-gray-500 mt-2">
            Comprehensive care for your perfect smile
          </p>
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 border"
            >
              <div className="text-blue-600 mb-4">
                {service.icon}
              </div>

              <h3 className="text-lg font-semibold text-gray-900">
                {service.title}
              </h3>

              <p className="text-gray-500 text-sm mt-2">
                {service.desc}
              </p>

              <div className="mt-4 font-semibold text-blue-600">
                {service.price}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}