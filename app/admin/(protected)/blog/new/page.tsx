"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter }   from "next/navigation";
import Link            from "next/link";
import { Save, Eye, ArrowLeft, Loader, Check } from "lucide-react";
import RichTextEditor  from "@/components/admin/RichTextEditor";

const CATEGORIES = [
  "Oral Health", "Root Canal", "Cosmetic Dentistry", "Dental Implants",
  "Orthodontics", "Kids Dentistry", "Preventive Care",
  "Clinic News", "Patient Stories",
];

const SUGGESTED_TAGS: Record<string, string[]> = {
  "Root Canal":        ["root canal Tripunithura", "painless root canal", "RCT Kerala", "tooth pain treatment"],
  "Dental Implants":   ["dental implants Tripunithura", "implants cost Kerala", "missing teeth solution"],
  "Orthodontics":      ["clear aligners Tripunithura", "braces Ernakulam", "invisible braces Kerala"],
  "Cosmetic Dentistry":["smile design Tripunithura", "teeth whitening Kerala", "cosmetic dentist Ernakulam"],
  "Oral Health":       ["dentist Tripunithura", "dental care tips", "oral hygiene Kerala"],
  "Kids Dentistry":    ["kids dentist Tripunithura", "children dental care Kerala", "pediatric dentist"],
  "Preventive Care":   ["dental checkup Tripunithura", "teeth cleaning Ernakulam", "preventive dentistry"],
  "Clinic News":       ["Vee Care Dental Clinic", "dental clinic Tripunithura"],
  "Patient Stories":   ["dental success story Kerala", "patient testimonial Tripunithura"],
};

export default function NewPostPage() {
  const router    = useRouter();
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [tab,     setTab]     = useState<"write" | "seo" | "settings">("write");
  const [tagInput,setTagInput]= useState("");
  const [tags,    setTags]    = useState<string[]>([]);
  // FIX: provide null as initial value so TypeScript is happy
  const autoSaveRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [form, setForm] = useState({
    title:          "",
    slug:           "",
    excerpt:        "",
    content:        "<p><br></p>",
    category:       "Oral Health",
    seoTitle:       "",
    seoDescription: "",
    featuredImage:  "",
    status:         "draft" as "draft" | "published",
  });

  const makeSlug = (t: string) =>
    t.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim().slice(0, 80);

  const set = (k: string, v: string) => {
    setForm(p => {
      const next = { ...p, [k]: v };
      if (k === "title") {
        if (!p.slug || p.slug === makeSlug(p.title)) next.slug = makeSlug(v);
        if (!p.seoTitle) next.seoTitle = v + " | Vee Care Dental";
      }
      if (k === "excerpt" && !p.seoDescription) {
        next.seoDescription = v.slice(0, 160);
      }
      return next;
    });
    setSaved(false);
  };

  const addTag = (tag: string) => {
    const clean = tag.trim();
    if (clean && !tags.includes(clean)) setTags(t => [...t, clean]);
    setTagInput("");
  };

  const removeTag = (tag: string) => setTags(t => t.filter(x => x !== tag));

  // Auto-save draft every 30s
  useEffect(() => {
    if (!form.title) return;
    if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    autoSaveRef.current = setTimeout(() => {
      handleSave("draft", true);
    }, 30000);
    return () => {
      if (autoSaveRef.current) clearTimeout(autoSaveRef.current);
    };
  }, [form]);

  const handleSave = async (status: "draft" | "published", silent = false) => {
    if (!form.title.trim())   { if (!silent) alert("Please add a title first."); return; }
    if (!form.content.replace(/<[^>]*>/g,"").trim() && !silent) {
      alert("Please write some content first."); return;
    }
    if (!silent) setSaving(true);
    try {
      const res  = await fetch("/api/blog", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, tags, status }),
      });
      const data = await res.json();
      if (!data.success) { if (!silent) alert("Failed to save. Try again."); return; }
      if (!silent) { router.push("/admin/blog"); router.refresh(); }
      else setSaved(true);
    } catch {
      if (!silent) alert("Something went wrong.");
    } finally {
      if (!silent) setSaving(false);
    }
  };

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;
  const suggested   = SUGGESTED_TAGS[form.category] || [];

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/blog" className="text-white/50 hover:text-white shrink-0">
              <ArrowLeft size={18} />
            </Link>
            <div className="min-w-0">
              <h1 className="text-white font-bold text-sm truncate">New Blog Post</h1>
              <p className="text-white/40 text-[11px]">Write an article for your blog</p>
            </div>
          </div>
          {saved && (
            <div className="hidden md:flex items-center gap-1.5 text-green-400 text-xs">
              <Check size={13} /> Saved just now
            </div>
          )}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => handleSave("draft")} disabled={saving}
              className="flex items-center gap-1.5 border border-white/25 text-white/70 hover:text-white text-xs font-semibold px-3 py-2 transition-all disabled:opacity-50 rounded">
              {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
              Save Draft
            </button>
            <button onClick={() => handleSave("published")} disabled={saving}
              className="flex items-center gap-1.5 bg-[#C1583B] hover:bg-[#b8935a] text-[#0D1117] text-xs font-bold px-4 py-2 transition-all disabled:opacity-50 rounded">
              {saving ? <Loader size={12} className="animate-spin" /> : <Eye size={12} />}
              Publish Now
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-200 px-6 sticky top-[61px] z-40">
        <div className="max-w-7xl mx-auto flex gap-0">
          {(["write","seo","settings"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3.5 text-sm font-medium transition-colors capitalize border-b-2 ${
                tab === t ? "border-[#C1583B] text-[#0D1117]" : "border-transparent text-gray-400 hover:text-gray-700"
              }`}>
              {t === "write" ? "✍️ Write" : t === "seo" ? "🔍 SEO" : "⚙️ Settings"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* WRITE TAB */}
        {tab === "write" && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">

              {/* Title */}
              <div className="bg-white shadow-sm p-6">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Title *</label>
                <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                  placeholder="e.g. 10 Signs You Need a Root Canal"
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-[#0D1117] text-xl font-semibold transition-colors"
                  style={{ fontSize: "20px" }} />
                {form.slug && (
                  <p className="text-[11px] text-gray-400 mt-2">
                    URL: /blog/<span className="font-mono text-gray-600">{form.slug}</span>
                  </p>
                )}
              </div>

              {/* Excerpt */}
              <div className="bg-white shadow-sm p-6">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-1">Short Description</label>
                <p className="text-[11px] text-gray-400 mb-3">1–2 sentences shown on blog listing and Google search.</p>
                <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
                  rows={2} maxLength={300} placeholder="Brief summary that makes readers want to click..."
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                  style={{ fontSize: "15px" }} />
                <p className="text-right text-[11px] text-gray-400 mt-1">{form.excerpt.length}/300</p>
              </div>

              {/* Editor */}
              <div className="bg-white shadow-sm p-6">
                <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-1">Article Content *</label>
                <p className="text-[11px] text-gray-400 mb-3">
                  Use toolbar or Quick Insert buttons. Press <kbd className="bg-gray-100 px-1 rounded text-[10px]">Enter</kbd> for new paragraph.
                </p>
                <RichTextEditor value={form.content} onChange={v => set("content", v)} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Publish */}
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D1117] text-sm mb-4">Publish</h3>
                <div className="space-y-3">
                  <button onClick={() => handleSave("published")} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white font-semibold py-3.5 text-sm transition-all disabled:opacity-50 rounded">
                    <Eye size={15} /> Publish Now
                  </button>
                  <button onClick={() => handleSave("draft")} disabled={saving}
                    className="w-full flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-600 hover:border-[#0D1117] hover:text-[#0D1117] font-semibold py-3 text-sm transition-all rounded">
                    <Save size={15} /> Save as Draft
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-3">Auto-saves draft every 30 seconds</p>
              </div>

              {/* Category */}
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D1117] text-sm mb-4">Category</h3>
                <div className="space-y-1.5">
                  {CATEGORIES.map(cat => (
                    <label key={cat} className={`flex items-center gap-3 p-2.5 rounded cursor-pointer transition-colors ${
                      form.category === cat ? "bg-[#0D1117]/5 text-[#0D1117]" : "hover:bg-gray-50 text-gray-600"
                    }`}>
                      <input type="radio" name="category" value={cat}
                        checked={form.category === cat}
                        onChange={e => set("category", e.target.value)}
                        className="accent-[#0D1117]" />
                      <span className={`text-sm ${form.category === cat ? "font-semibold" : ""}`}>{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D1117] text-sm mb-1">Tags</h3>
                <p className="text-[11px] text-gray-400 mb-3">Keywords that help Google rank your article</p>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-1 bg-[#0D1117] text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-white/60 hover:text-white ml-0.5">×</button>
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input type="text" value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(tagInput); } }}
                    placeholder="Type a tag, press Enter"
                    className="flex-1 border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2 outline-none text-sm transition-colors" />
                  <button type="button" onClick={() => addTag(tagInput)}
                    className="bg-[#0D1117] text-white text-xs font-bold px-3 py-2 hover:bg-[#C1583B] hover:text-[#0D1117] transition-colors">
                    Add
                  </button>
                </div>
                {suggested.filter(t => !tags.includes(t)).length > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] text-gray-400 mb-2 font-semibold uppercase tracking-wider">Suggested:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {suggested.filter(t => !tags.includes(t)).map(tag => (
                        <button key={tag} type="button" onClick={() => addTag(tag)}
                          className="text-[11px] bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 px-2 py-1 rounded transition-colors">
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Featured image */}
              <div className="bg-white shadow-sm p-6">
                <h3 className="font-bold text-[#0D1117] text-sm mb-1">Featured Image</h3>
                <p className="text-[11px] text-gray-400 mb-3">Paste any image URL</p>
                <input type="url" value={form.featuredImage} onChange={e => set("featuredImage", e.target.value)}
                  placeholder="https://..."
                  className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-sm transition-colors" />
                {form.featuredImage && (
                  <div className="mt-3 rounded overflow-hidden bg-gray-100 aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.featuredImage} alt="Preview" className="w-full h-full object-cover"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SEO TAB */}
        {tab === "seo" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white shadow-sm p-7">
              <h2 className="font-bold text-[#0D1117] mb-1">SEO Settings</h2>
              <p className="text-sm text-gray-500 mb-6">Controls how your article appears in Google search results.</p>
              <div className="space-y-5">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    SEO Title <span className="font-normal text-gray-400 ml-1 normal-case tracking-normal">(blue link in Google)</span>
                  </label>
                  <input type="text" value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)}
                    maxLength={70} placeholder="10 Signs You Need a Root Canal | Vee Care Tripunithura"
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm transition-colors"
                    style={{ fontSize: "15px" }} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Ideal: 50–60 chars. Include clinic name + city.</p>
                    <p className={`text-[11px] font-semibold ${seoTitleLen > 60 ? "text-red-500" : seoTitleLen > 40 ? "text-green-600" : "text-gray-400"}`}>
                      {seoTitleLen}/70
                    </p>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">
                    Meta Description <span className="font-normal text-gray-400 ml-1 normal-case tracking-normal">(grey text in Google)</span>
                  </label>
                  <textarea value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)}
                    rows={4} maxLength={165}
                    placeholder="Learn the 10 warning signs that you might need a root canal. Expert dental advice from Vee Care Dental Clinic, Tripunithura, Kerala."
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                    style={{ fontSize: "15px" }} />
                  <div className="flex justify-between mt-1">
                    <p className="text-[11px] text-gray-400">Ideal: 140–160 chars. Include city name.</p>
                    <p className={`text-[11px] font-semibold ${seoDescLen > 160 ? "text-red-500" : seoDescLen > 100 ? "text-green-600" : "text-gray-400"}`}>
                      {seoDescLen}/165
                    </p>
                  </div>
                </div>
              </div>
              {(form.seoTitle || form.title) && (
                <div className="mt-6 border-2 border-dashed border-gray-200 p-5 rounded">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 mb-3">📱 Google Preview</p>
                  <div className="text-[#1a0dab] text-base leading-snug">{form.seoTitle || form.title}</div>
                  <div className="text-[#006621] text-xs mt-1">smilecare.in › blog › {form.slug || "article-url"}</div>
                  <div className="text-[#545454] text-sm mt-1 leading-snug">
                    {form.seoDescription || form.excerpt || "Add a meta description..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="max-w-lg space-y-5">
            <div className="bg-white shadow-sm p-7">
              <h2 className="font-bold text-[#0D1117] mb-5">Post Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">URL Slug</label>
                  <input type="text" value={form.slug} onChange={e => set("slug", makeSlug(e.target.value))}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm font-mono transition-colors" />
                  <p className="text-[11px] text-gray-400 mt-1">
                    Final URL: smilecare.in/blog/{form.slug || "auto-generated"}
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">Status</label>
                  <div className="flex gap-3">
                    {(["draft","published"] as const).map(s => (
                      <label key={s} className={`flex items-center gap-2 px-4 py-3 border-2 cursor-pointer flex-1 transition-colors rounded ${
                        form.status === s ? "border-[#0D1117] bg-[#0D1117]/5" : "border-gray-200 hover:border-gray-400"
                      }`}>
                        <input type="radio" name="status" value={s}
                          checked={form.status === s}
                          onChange={() => setForm(p => ({ ...p, status: s }))}
                          className="accent-[#0D1117]" />
                        <span className="text-sm font-medium capitalize text-[#0D1117]">{s}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
