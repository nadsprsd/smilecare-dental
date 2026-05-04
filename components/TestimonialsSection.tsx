"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Ramesh Kumar",
    text: "Got my dental implants done here. Dr. Priya is amazing — painless and highly professional!",
  },
  {
    name: "Anjali Nair",
    text: "Very clean clinic and friendly staff. My teeth whitening results were fantastic!",
  },
  {
    name: "Suresh Pillai",
    text: "Best dental experience I've had. Highly recommend SmileCare.",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 bg-blue-900 text-white">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <p className="text-blue-300 font-semibold mb-2">
          PATIENT REVIEWS
        </p>

        <h2 className="text-3xl font-bold mb-10">
          What Our Patients Say
        </h2>

        <div className="space-y-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="bg-white/10 backdrop-blur p-6 rounded-xl"
            >
              <p className="italic text-blue-100">
                “{t.text}”
              </p>

              <div className="mt-3 font-semibold">
                — {t.name}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-yellow-400">
          ⭐⭐⭐⭐⭐ 4.9 (180+ Google Reviews)
        </div>

      </div>
    </section>
  );
}