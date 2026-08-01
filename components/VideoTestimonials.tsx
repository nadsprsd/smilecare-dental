"use client";

import { useState } from "react";
import { Play } from "lucide-react";

export interface VideoItem {
  id: string;
  type: "youtube" | "mp4";
  src: string;          // YouTube video ID (e.g. "dQw4w9WgXcQ") or "/videos/patient1.mp4"
  thumbnail: string;    // /videos/thumbs/patient1.jpg — a static preview image (keeps page light)
  patientName: string;  // first name / initials only, e.g. "Anjali N."
  treatment: string;    // e.g. "Dental Implant"
}

// No sample data by default — pointing at fake thumbnail/video paths just
// produces 404s and broken-image errors in the console. Pass real videos
// in via the `videos` prop once the clinic sends clips, e.g.:
// <VideoTestimonials videos={[
//   { id: "v1", type: "youtube", src: "dQw4w9WgXcQ", thumbnail: "/videos/thumbs/patient1.jpg", patientName: "Anjali N.", treatment: "Dental Implant" },
// ]} />
const DEFAULT_VIDEOS: VideoItem[] = [];

function VideoCard({ video }: { video: VideoItem }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[9/16] md:aspect-video bg-black overflow-hidden group">
      {playing ? (
        video.type === "youtube" ? (
          <iframe
            className="w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.src}?autoplay=1&rel=0`}
            title={`${video.patientName} — ${video.treatment} testimonial`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <video className="w-full h-full object-cover" src={video.src} controls autoPlay playsInline />
        )
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="absolute inset-0 w-full h-full"
          aria-label={`Play ${video.patientName}'s ${video.treatment} story`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={video.thumbnail}
            alt={`${video.patientName} — ${video.treatment}`}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
              <Play size={22} className="text-[#C1583B] ml-0.5" fill="#C1583B" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
            <div className="text-white font-semibold text-sm">{video.patientName}</div>
            <div className="text-white/70 text-xs">{video.treatment}</div>
          </div>
        </button>
      )}
    </div>
  );
}

export default function VideoTestimonials({ videos = DEFAULT_VIDEOS }: { videos?: VideoItem[] }) {
  if (videos.length === 0) return null; // nothing to show until real clips are added — avoids broken placeholders

  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <span className="gold-rule mx-auto" />
          <span className="label-text block mb-4">Patient Stories</span>
          <h2 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
            Hear It From
            <br />
            <span className="italic text-[#C1583B]">Our Patients.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {videos.map((v) => (
            <VideoCard key={v.id} video={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
