"use client";

export default function BookingCTA() {
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">

        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold">
            Ready for a Healthier Smile?
          </h2>

          <p className="text-blue-100 mt-2">
            Book your appointment in 60 seconds. First consultation is FREE.
          </p>

          <div className="mt-4 text-sm text-blue-200 space-y-1">
            <p>✔ Open Mon–Sat (9am–7pm)</p>
            <p>✔ Trusted by 2000+ patients</p>
          </div>
        </div>

        {/* RIGHT BUTTONS */}
        <div className="flex gap-4">
          <button className="bg-white text-blue-600 px-6 py-3 rounded-full shadow hover:bg-gray-100">
            Book Appointment
          </button>

          <button className="bg-green-500 px-6 py-3 rounded-full shadow hover:bg-green-600">
            WhatsApp Us
          </button>
        </div>

      </div>
    </section>
  );
}