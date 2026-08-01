"use client";

import { Star } from "lucide-react";

// Opens Google's own "write a review" flow in a new tab — no form/data ever
// touches our site, so there's nothing for us to moderate or store.
// Needs NEXT_PUBLIC_GOOGLE_PLACE_ID set in .env.local (same Place ID used
// by app/api/google-reviews/route.ts, just exposed client-side since it's
// not a secret — only the API key is).

export default function WriteReviewButton({ className = "" }: { className?: string }) {
  const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID;
  const href = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : "#";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2.5 bg-[#0F2E2E] hover:bg-[#C1583B] text-white font-medium px-8 py-4 transition-all duration-300 text-sm ${className}`}
      style={{ letterSpacing: "0.04em" }}
    >
      <Star size={16} strokeWidth={1.5} fill="currentColor" />
      Write a Review on Google
    </a>
  );
}
