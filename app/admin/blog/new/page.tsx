"use client";

import { useState }  from "react";
import { useRouter } from "next/navigation";
import Link          from "next/link";
import { Save, Eye, ArrowLeft, Loader } from "lucide-react";

const CATEGORIES = [
  "Oral Health", "Cosmetic Dentistry", "Dental Implants",
  "Orthodontics", "Kids Dentistry", "Preventive Care",
  "Clinic News", "Patient Stories",
];

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form,   setForm]   = useState({
    title:          "",
    excerpt:        "",
    content:        "",
    category:       "Oral Health",
    seoTitle:       "",
    seoDescription: "",
    featuredImage:  "",
    status:         "draft" as "draft" | "published",
  });

  const set = (k: string, v: string) => {
    setForm(p => {
      const updated = { ...p, [k]: v };
      // Auto-fill SEO title from title if empty
      if (k === "title" && !p.seoTitle) {
        updated.seoTitle = v + " | SmileCare Dental";
      }
      // Auto-fill SEO description from excerpt if empty
      if (k === "excerpt" && !p.seoDescription) {
        updated.seoDescription = v.slice(0, 160);
      }
      return updated;
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title.trim()) { alert("Title is required"); return; }
    if (!form.content.trim()) { alert("Content is required"); return; }

    setSaving(true);
    try {
      const res  = await fetch("/api/blog", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, status }),
      });
      const data = await res.json();

      if (!data.success) {
        alert("Failed to save. Please try again.");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      alert("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] px-8 py-5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="text-white font-bold">New Blog Post</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white hover:border-white text-xs font-semibold px-4 py-2 transition-all disabled:opacity-50"
            >
              {saving ? <Loader size={13} className="animate-spin" /> : <Save size={13} />}
              Save Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#0D1117] text-xs font-bold px-4 py-2 transition-all disabled:opacity-50"
            >
              {saving ? <Loader size={13} className="animate-spin" /> : <Eye size={13} />}
              Publish Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main content — left 2 columns */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">
                Post Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={e => set("title", e.target.value)}
                placeholder="e.g. 10 Habits for Healthy Teeth Your Dentist Recommends"
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-[#0D1117] text-lg font-semibold transition-colors"
                style={{ fontSize: "18px" }}
              />
            </div>

            {/* Excerpt */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                Short Description / Excerpt *
              </label>
              <p className="text-[#4A5568] text-xs mb-3">
                Shown on the blog listing page. Keep it under 160 characters.
              </p>
              <textarea
                value={form.excerpt}
                onChange={e => set("excerpt", e.target.value)}
                rows={3}
                maxLength={300}
                placeholder="A brief summary of this article that will appear in the blog list..."
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                style={{ fontSize: "16px" }}
              />
              <p className="text-right text-xs text-[#4A5568] mt-1">{form.excerpt.length}/300</p>
            </div>

            {/* Content */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                Article Content *
              </label>
              <p className="text-[#4A5568] text-xs mb-3">
                Write your full article here. Use HTML for formatting:
                <code className="bg-gray-100 px-1 mx-1">&lt;h2&gt;</code> for headings,
                <code className="bg-gray-100 px-1 mx-1">&lt;p&gt;</code> for paragraphs,
                <code className="bg-gray-100 px-1 mx-1">&lt;ul&gt;&lt;li&gt;</code> for lists,
                <code className="bg-gray-100 px-1 mx-1">&lt;strong&gt;</code> for bold.
              </p>
              <textarea
                value={form.content}
                onChange={e => set("content", e.target.value)}
                rows={20}
                placeholder={`<p>Start writing your article here...</p>\n\n<h2>Why This Matters</h2>\n<p>Explain the importance...</p>\n\n<h2>Key Points</h2>\n<ul>\n  <li>First point</li>\n  <li>Second point</li>\n</ul>`}
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-y text-sm font-mono transition-colors"
                style={{ fontSize: "14px", minHeight: "400px" }}
              />
              <p className="text-right text-xs text-[#4A5568] mt-1">{form.content.length} characters</p>
            </div>

            {/* SEO Section */}
            <div className="bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D1117] text-sm mb-1 flex items-center gap-2">
                🔍 SEO Settings
              </h3>
              <p className="text-[#4A5568] text-xs mb-5">
                These help Google find and rank your article. Fill both for best results.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    SEO Title (shown in Google results)
                  </label>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={e => set("seoTitle", e.target.value)}
                    maxLength={70}
                    placeholder="10 Habits for Healthy Teeth | SmileCare Dental Tripunithura"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm transition-colors"
                    style={{ fontSize: "16px" }}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-[#4A5568]">Ideal: 50–60 characters. Include clinic name.</p>
                    <p className={`text-xs font-semibold ${seoTitleLen > 60 ? "text-red-500" : seoTitleLen > 40 ? "text-green-600" : "text-[#4A5568]"}`}>
                      {seoTitleLen}/70
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Meta Description (shown under title in Google)
                  </label>
                  <textarea
                    value={form.seoDescription}
                    onChange={e => set("seoDescription", e.target.value)}
                    rows={3}
                    maxLength={165}
                    placeholder="Learn the 10 dental habits recommended by our dentists at SmileCare in Tripunithura, Kerala. Expert tips for a lifetime of healthy teeth."
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                    style={{ fontSize: "16px" }}
                  />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-[#4A5568]">Ideal: 140–160 characters. Include your city name.</p>
                    <p className={`text-xs font-semibold ${seoDescLen > 160 ? "text-red-500" : seoDescLen > 100 ? "text-green-600" : "text-[#4A5568]"}`}>
                      {seoDescLen}/165
                    </p>
                  </div>
                </div>
              </div>

              {/* Google preview */}
              {(form.seoTitle || form.title) && (
                <div className="mt-5 border border-gray-200 p-4 bg-gray-50">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">
                    Google Preview
                  </p>
                  <div className="text-[#1a0dab] text-base hover:underline cursor-pointer">
                    {form.seoTitle || form.title}
                  </div>
                  <div className="text-[#006621] text-xs mt-0.5">
                    smilecare.in/blog/{form.title ? form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "").slice(0, 40) : "article-slug"}
                  </div>
                  <div className="text-[#545454] text-sm mt-1 leading-snug">
                    {form.seoDescription || form.excerpt || "Add a meta description to control what Google shows here..."}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar — right 1 column */}
          <div className="space-y-5">

            {/* Publish options */}
            <div className="bg-white shadow-sm p-6">
              <h4 className="font-bold text-[#0D1117] text-sm mb-4">Publish</h4>
              <div className="space-y-3">
                <button onClick={() => handleSave("published")} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold py-3 text-sm transition-all disabled:opacity-50">
                  {saving ? <Loader size={14} className="animate-spin" /> : <Eye size={14} />}
                  Publish Now
                </button>
                <button onClick={() => handleSave("draft")} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#4A5568] hover:text-[#0D1117] hover:border-[#0D1117] font-semibold py-3 text-sm transition-all disabled:opacity-50">
                  <Save size={14} /> Save as Draft
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">
                Category
              </label>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={form.category === cat}
                      onChange={e => set("category", e.target.value)}
                      className="accent-[#0D1117]"
                    />
                    <span className={`text-sm transition-colors ${form.category === cat ? "text-[#0D1117] font-semibold" : "text-[#4A5568] group-hover:text-[#0D1117]"}`}>
                      {cat}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Featured image */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">
                Featured Image URL
              </label>
              <p className="text-[#4A5568] text-xs mb-3">
                Paste an image URL. Use picsum.photos or upload to your WordPress media library.
              </p>
              <input
                type="url"
                value={form.featuredImage}
                onChange={e => set("featuredImage", e.target.value)}
                placeholder="https://picsum.photos/800/400"
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-xs transition-colors"
              />
              {form.featuredImage && (
                <div className="mt-3 relative aspect-video overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Writing tips */}
            <div className="bg-[#F4F7FA] border border-gray-100 p-5">
              <h4 className="font-bold text-[#0D1117] text-xs mb-3">Writing Tips for SEO</h4>
              <ul className="space-y-2 text-xs text-[#4A5568]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] shrink-0">→</span>
                  Include your city name (Tripunithura) naturally in the article
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] shrink-0">→</span>
                  Write at least 500 words for Google to rank it
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] shrink-0">→</span>
                  Use h2 headings with keywords patients search for
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] shrink-0">→</span>
                  End with a call-to-action to book an appointment
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C9A96E] shrink-0">→</span>
                  Publish consistently — 1 article per week is ideal
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

