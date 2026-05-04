"use client";

import { useState } from "react";

interface Props {
  id: string;
  name: string;
  phone: string;
  service: string;
  date: string;
  time: string;
}

export default function ConfirmButton({ id, name, phone, service, date, time }: Props) {
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);

  const handleConfirm = async () => {
    setLoading(true);

    try {
      // 1. Update MongoDB first — wait for it to complete
      const res = await fetch(`/api/appointments/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: "confirmed" }),
      });

      const data = await res.json();
      console.log("Update result:", data);

      if (!res.ok || !data.success) {
        alert("Failed to update. Check console.");
        setLoading(false);
        return;
      }

      // 2. Build WhatsApp message
      const phoneClean = phone.replace(/\D/g, "");
      const e164 = phoneClean.length === 10 ? "91" + phoneClean : phoneClean;

      const formattedDate = date
        ? new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
            weekday: "long",
            day:     "numeric",
            month:   "long",
            year:    "numeric",
          })
        : date;

      const message =
        `Hi ${name},\n\n` +
        `Your appointment at SmileCare Dental is CONFIRMED.\n\n` +
        `Service : ${service}\n` +
        `Date    : ${formattedDate}\n` +
        `Time    : ${time}\n\n` +
        `Location: MG Road, Tripunithura, Ernakulam\n\n` +
        `Please arrive 5 minutes early.\n` +
        `To reschedule, reply to this message or call us.\n\n` +
        `See you soon!\n` +
        `-- SmileCare Dental Team`;

      // 3. Open WhatsApp
      window.open(
        `https://wa.me/${e164}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // 4. Mark as done
      setDone(true);

      // 5. Reload page after 1.5 seconds — enough time for MongoDB to persist
      setTimeout(() => {
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  if (done) {
    return (
      <span className="text-green-600 text-[11px] font-bold px-2.5 py-1.5 bg-green-50 border border-green-200">
        Sent
      </span>
    );
  }

  return (
    <button
      onClick={handleConfirm}
      disabled={loading}
      className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-[11px] font-bold px-2.5 py-1.5 transition-colors whitespace-nowrap"
    >
      {loading ? "Sending..." : "Confirm"}
    </button>
  );
}