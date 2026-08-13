"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

const CATEGORIES = ["All", "Our Clinic", "Procedures"];

// Real photos from the clinic's own Google Business Profile. Only honest,
// generic captions here — no invented statistics, no doctor names attached
// to photos we can't verify, no fabricated before/after claims. Expand this
// list as the clinic sends more real photos.
const GALLERY = [
  {
    id: 1, cat: "Our Clinic",
    title: "Vee Care Dental Clinic",
    sub: "Our clinic signage, Tripunithura",
    img: "/photos/clinic-storefront.webp",
  },
  {
    id: 2, cat: "Procedures",
    title: "Patient Care in Progress",
    sub: "Our team at work in the treatment room",
    img: "/photos/clinic-team-hero.webp",
  },
  {
    id: 3, cat: "Procedures",
    title: "Treatment in Progress",
    sub: "Focused, careful chairside care",
    img: "/photos/clinic-procedure-1.webp",
  },
  {
    id: 4, cat: "Procedures",
    title: "Our Team at Work",
    sub: "Dentist and assistant during a procedure",
    img: "/photos/clinic-procedure-2.webp",
  },
  {
    id: 5, cat: "Our Clinic",
    title: "Modern Dental Technology",
    sub: "Digital imaging used for treatment planning",
    img: "/photos/clinic-technology.webp",
  },
  {
    id: 6, cat: "Procedures",
    title: "Chairside Care",
    sub: "Precision and attention at every visit",
    img: "/photos/clinic-procedure-3.webp",
  },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    activeCategory === "All"
      ? GALLERY
      : GALLERY.filter((g) => g.cat === activeCategory);

  const lbIdx  = lightbox !== null ? filtered.findIndex((g) => g.id === lightbox) : -1;
  const lbItem = lbIdx >= 0 ? filtered[lbIdx] : null;

  const goNext = () => {
    if (lbIdx < filtered.length - 1) setLightbox(filtered[lbIdx + 1].id);
  };
  const goPrev = () => {
    if (lbIdx > 0) setLightbox(filtered[lbIdx - 1].id);
  };

  return (
    <div className="bg-white min-h-screen">

      {/* ── Header ── */}
      <div className="relative h-80 overflow-hidden bg-[#0D1117]">
        <Image
          src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=1600&q=80"
          alt="Vee Care Gallery"
          fill
          className="object-cover opacity-35"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117]/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="label-text block mb-4">Our Work</span>
          <h1
            className="display-text text-white"
            style={{ fontSize: "clamp(2.5rem, 5vw, 4.5rem)" }}
          >
            See the Results
            <br />
            <span className="italic text-[#C1583B]">For Yourself.</span>
          </h1>
          <p className="text-white/60 mt-4 text-base max-w-xl">
            Real patient transformations, our clinic, our team, and our procedures — nothing staged.
          </p>
        </div>
      </div>

      {/* ── Category filters ── */}
      <div className="sticky top-[60px] z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex gap-3 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2 text-sm font-medium tracking-wide transition-all ${
                activeCategory === cat
                  ? "bg-[#0D1117] text-white"
                  : "border border-[#0D1117]/15 text-[#4A5568] hover:border-[#0D1117] hover:text-[#0D1117]"
              }`}
            >
              {cat}
              <span className="ml-2 text-xs opacity-60">
                ({cat === "All" ? GALLERY.length : GALLERY.filter((g) => g.cat === cat).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-14">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#4A5568]">No photos in this category.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setLightbox(item.id)}
                className="group relative overflow-hidden aspect-square text-left focus:outline-none focus:ring-2 focus:ring-[#C1583B]"
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-[#0D1117]/0 group-hover:bg-[#0D1117]/65 transition-all duration-400 flex flex-col justify-end p-4">
                  <div className="translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-[#C1583B] text-[10px] font-bold tracking-widest uppercase mb-1">
                      {item.cat}
                    </div>
                    <div className="text-white text-sm font-medium leading-snug">
                      {item.title}
                    </div>
                    <div className="text-white/60 text-xs mt-1 leading-snug line-clamp-2">
                      {item.sub}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Consent note ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 pb-10">
        <div className="border border-blue-100 bg-blue-50 p-5 text-sm text-blue-700 leading-relaxed">
          <strong>Note for clinic owner:</strong> Replace the placeholder images above with real
          photos of your clinic and actual patient before/after results (with written patient
          consent). Real photos increase appointment bookings by up to 40% compared to stock images.
          WhatsApp us to discuss photo guidance.
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="bg-[#0D1117] py-20 text-center px-6">
        <span className="label-text block mb-4">Book Today</span>
        <h3
          className="display-text text-white mb-5"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Want Results Like These?
          <br />
          <span className="italic text-[#C1583B]">Let's Get Started.</span>
        </h3>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Book a free consultation. Our specialist will tell you exactly what's possible for your smile.
        </p>
        <Link href="/appointment" className="btn-white text-sm">
          Book Free Consultation <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </div>

      {/* ── Lightbox ── */}
      {lbItem && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 text-white/60 hover:text-white p-2 transition-colors"
            aria-label="Close"
          >
            <X size={26} />
          </button>

          {/* Prev */}
          {lbIdx > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="absolute left-4 md:left-8 text-white/60 hover:text-white p-3 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft size={32} />
            </button>
          )}

          {/* Next */}
          {lbIdx < filtered.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="absolute right-4 md:right-8 text-white/60 hover:text-white p-3 transition-colors"
              aria-label="Next"
            >
              <ChevronRight size={32} />
            </button>
          )}

          {/* Image card */}
          <div
            className="max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video overflow-hidden">
              <Image
                src={lbItem.img}
                alt={lbItem.title}
                fill
                className="object-cover"
                sizes="80vw"
              />
            </div>
            <div className="bg-[#0D1117] border-t border-white/10 p-5 flex items-center justify-between gap-4">
              <div>
                <div className="label-text">{lbItem.cat}</div>
                <div className="display-text text-white text-xl mt-1">{lbItem.title}</div>
                <div className="text-white/50 text-sm mt-1">{lbItem.sub}</div>
              </div>
              <Link
                href="/appointment"
                onClick={() => setLightbox(null)}
                className="btn-white text-xs shrink-0"
              >
                Book Now
              </Link>
            </div>
            <div className="text-white/30 text-center text-xs mt-3">
              {lbIdx + 1} / {filtered.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

