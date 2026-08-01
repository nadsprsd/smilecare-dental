"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import WriteReviewButton from "./WriteReviewButton";

interface Review {
  name: string;
  rating: number;
  date: string;
  text: string;
  photo: string | null;
}

interface ReviewsResponse {
  success: boolean;
  rating?: number | null;
  totalReviews?: number | null;
  reviews?: Review[];
  message?: string;
}

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "text-[#C1583B]" : "text-[#E7EAF0]"}
          fill="currentColor"
        />
      ))}
    </div>
  );
}

export default function GoogleReviews({
  variant = "preview",
}: {
  variant?: "preview" | "full";
}) {
  const [data, setData] = useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/google-reviews")
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const limit = variant === "preview" ? 3 : undefined;
  const reviews = data?.reviews?.slice(0, limit) ?? [];

  return (
    <section className={variant === "preview" ? "section-pad bg-[#0D1117] noise relative overflow-hidden" : "py-12"}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {variant === "preview" && (
          <div className="text-center mb-16">
            <span className="gold-rule mx-auto" />
            <span className="label-text block mb-4">Google Reviews</span>
            <h2 className="display-text text-white" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
              What Patients
              <br />
              <span className="italic text-[#C1583B]">Really Say.</span>
            </h2>
            {data?.rating && (
              <div className="flex items-center justify-center gap-2 mt-6 text-white">
                <Stars count={Math.round(data.rating)} />
                <span className="font-semibold">{data.rating}</span>
                <span className="text-white/60 text-sm">
                  ({data.totalReviews}+ Google Reviews)
                </span>
              </div>
            )}
          </div>
        )}

        {loading && (
          <p className={`text-center text-sm ${variant === "preview" ? "text-white/60" : "text-[#4A5568]"}`}>
            Loading reviews…
          </p>
        )}

        {!loading && data && !data.success && (
          <p className={`text-center text-sm ${variant === "preview" ? "text-white/60" : "text-[#4A5568]"}`}>
            Reviews aren&apos;t connected yet — {data.message}
          </p>
        )}

        {!loading && data?.success && reviews.length === 0 && (
          <p className={`text-center text-sm ${variant === "preview" ? "text-white/60" : "text-[#4A5568]"}`}>
            No reviews returned yet.
          </p>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className={
                variant === "preview"
                  ? "bg-white/5 border border-white/10 backdrop-blur p-6"
                  : "bg-white border border-[#E7EAF0] p-6"
              }
            >
              <Stars count={r.rating} />
              <p className={`mt-3 text-sm leading-relaxed ${variant === "preview" ? "text-white/80" : "text-[#4A5568]"}`}>
                &ldquo;{r.text}&rdquo;
              </p>
              <div className={`mt-4 flex items-center justify-between text-xs ${variant === "preview" ? "text-white/50" : "text-[#4A5568]"}`}>
                <span className="font-semibold">{r.name}</span>
                <span>{r.date}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 justify-center mt-14">
          <WriteReviewButton />
          {variant === "preview" && (
            <a
              href="/reviews"
              className="inline-flex items-center gap-2.5 border border-white/30 text-white hover:border-white px-8 py-4 transition-all text-sm font-medium tracking-wide"
            >
              Read All Reviews
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
