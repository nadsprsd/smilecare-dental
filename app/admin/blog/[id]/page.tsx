"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, Eye, ArrowLeft, Loader, Trash2 } from "lucide-react";
import RichTextEditor from "@/components/admin/RichTextEditor";

const CATEGORIES = [
  "Oral Health", "Cosmetic Dentistry", "Dental Implants",
  "Orthodontics", "Kids Dentistry", "Preventive Care",
  "Root Canal", "Clinic News", "Patient Stories",
];

const SUGGESTED_TAGS: Record<string, string[]> = {
  "Root Canal":        ["root canal Tripunithura", "painless root canal", "RCT Kerala"],
  "Dental Implants":   ["dental implants Tripunithura", "implants cost Kerala"],
  "Orthodontics":      ["clear aligners Tripunithura", "braces Ernakulam"],
  "Cosmetic Dentistry":["smile design Tripunithura", "teeth whitening Kerala"],
  "Oral Health":       ["dentist Tripunithura", "dental tips Kerala"],
  "Kids Dentistry":    ["kids dentist Tripunithura", "pediatric dental Kerala"],
  "Preventive Care":   ["dental checkup Tripunithura", "teeth cleaning Ernakulam"],
  "Clinic News":       ["Vee Care Dental", "dental clinic Tripunithura"],
  "Patient Stories":   ["patient review Tripunithura", "dental success story Kerala"],
};

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const id     = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [form,    setForm]    = useState({
    title:          "",
    excerpt:        "",
    content:        "",
    category:       "Oral Health",
    tags:           "",
    seoTitle:       "",
    seoDescription: "",
    featuredImage:  "",
    status:         "draft" as "draft" | "published",
  });

  useEffect(() => {
    async function load() {
      try {
        const res  = await fetch(`/api/blog/${id}`);
        const data = await res.json();
        if (data.success && data.post) {
          const p = data.post;
          setForm({
            title:          p.title          || "",
            excerpt:        p.excerpt        || "",
            content:        p.content        || "",
            category:       p.category       || "Oral Health",
            tags:           Array.isArray(p.tags) ? p.tags.join(", ") : (p.tags || ""),
            seoTitle:       p.seoTitle       || "",
            seoDescription: p.seoDescription || "",
            featuredImage:  p.featuredImage  || "",
            status:         p.status         || "draft",
          });
        }
      } catch { alert("Could not load post."); }
      finally  { setLoading(false); }
    }
    load();
  }, [id]);

  const set = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title.trim())   { alert("Title is required");   return; }
    if (!form.content.trim()) { alert("Content is required"); return; }

    setSaving(true);
    try {
      const res  = await fetch(`/api/blog/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...form, status }),
      });
      const data = await res.json();
      if (!data.success) { alert("Failed to save."); return; }
      router.push("/admin/blog");
      router.refresh();
    } catch { alert("Something went wrong."); }
    finally  { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${form.title}"?\n\nThis cannot be undone.`)) return;
    const res  = await fetch(`/api/blog/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) { router.push("/admin/blog"); router.refresh(); }
    else alert("Failed to delete.");
  };

  const seoTitleLen = form.seoTitle.length;
  const seoDescLen  = form.seoDescription.length;
  const suggested   = SUGGESTED_TAGS[form.category] || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
        <div className="flex items-center gap-2 text-[#4A5568]">
          <Loader size={18} className="animate-spin" /> Loading post...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F7FA]">

      {/* Header */}
      <div className="bg-[#0D1117] px-8 py-5 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/blog" className="text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <span className="text-white font-bold">Edit Post</span>
            <span className={`text-[10px] font-bold px-2.5 py-1 ${
              form.status === "published" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
            }`}>
              {form.status === "published" ? "Published" : "Draft"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={handleDelete}
              className="flex items-center gap-1.5 border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold px-3 py-2 transition-all">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => handleSave("draft")} disabled={saving}
              className="flex items-center gap-2 border border-white/20 text-white/70 hover:text-white text-xs font-semibold px-4 py-2 transition-all disabled:opacity-50">
              {saving ? <Loader size={13} className="animate-spin" /> : <Save size={13} />} Save Draft
            </button>
            <button onClick={() => handleSave("published")} disabled={saving}
              className="flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-[#0D1117] text-xs font-bold px-4 py-2 transition-all disabled:opacity-50">
              {saving ? <Loader size={13} className="animate-spin" /> : <Eye size={13} />}
              {form.status === "published" ? "Update" : "Publish"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Main content */}
          <div className="lg:col-span-2 space-y-5">

            {/* Title */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Post Title *</label>
              <input type="text" value={form.title} onChange={e => set("title", e.target.value)}
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-[#0D1117] text-lg font-semibold transition-colors"
                style={{ fontSize: "18px" }} />
            </div>

            {/* Excerpt */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widests uppercase text-[#0D1117] mb-2">Short Description *</label>
              <textarea value={form.excerpt} onChange={e => set("excerpt", e.target.value)}
                rows={2} maxLength={300}
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                style={{ fontSize: "16px" }} />
              <p className="text-right text-xs text-[#4A5568] mt-1">{form.excerpt.length}/300</p>
            </div>

            {/* Rich Text Editor */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">Article Content *</label>
              <RichTextEditor value={form.content} onChange={v => set("content", v)} />
            </div>

            {/* SEO */}
            <div className="bg-white shadow-sm p-6">
              <h3 className="font-bold text-[#0D1117] text-sm mb-5">🔍 SEO Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">SEO Title</label>
                  <input type="text" value={form.seoTitle} onChange={e => set("seoTitle", e.target.value)} maxLength={70}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none text-sm transition-colors"
                    style={{ fontSize: "16px" }} />
                  <p className={`text-right text-xs mt-1 font-semibold ${seoTitleLen > 60 ? "text-red-500" : seoTitleLen > 40 ? "text-green-600" : "text-[#4A5568]"}`}>
                    {seoTitleLen}/70
                  </p>
                </div>
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Meta Description</label>
                  <textarea value={form.seoDescription} onChange={e => set("seoDescription", e.target.value)}
                    rows={3} maxLength={165}
                    className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-4 py-3 outline-none resize-none text-sm transition-colors"
                    style={{ fontSize: "16px" }} />
                  <p className={`text-right text-xs mt-1 font-semibold ${seoDescLen > 160 ? "text-red-500" : seoDescLen > 100 ? "text-green-600" : "text-[#4A5568]"}`}>
                    {seoDescLen}/165
                  </p>
                </div>
              </div>
              {(form.seoTitle || form.title) && (
                <div className="mt-5 border border-gray-200 p-4 bg-gray-50">
                  <p className="text-[10px] font-bold tracking-widest uppercase text-[#4A5568] mb-3">Google Preview</p>
                  <div className="text-[#1a0dab] text-base">{form.seoTitle || form.title}</div>
                  <div className="text-[#006621] text-xs mt-0.5">smilecare.in/blog/...</div>
                  <div className="text-[#545454] text-sm mt-1">{form.seoDescription || form.excerpt}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">

            {/* Publish */}
            <div className="bg-white shadow-sm p-6">
              <h4 className="font-bold text-[#0D1117] text-sm mb-4">Status</h4>
              <div className="space-y-3">
                <button onClick={() => handleSave("published")} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 bg-[#0D1117] hover:bg-[#C9A96E] text-white font-semibold py-3 text-sm transition-all disabled:opacity-50">
                  <Eye size={14} /> {form.status === "published" ? "Update Post" : "Publish Now"}
                </button>
                <button onClick={() => handleSave("draft")} disabled={saving}
                  className="w-full flex items-center justify-center gap-2 border border-gray-200 text-[#4A5568] hover:border-[#0D1117] font-semibold py-3 text-sm transition-all">
                  <Save size={14} /> Save as Draft
                </button>
                <button onClick={handleDelete}
                  className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold py-3 text-sm transition-all">
                  <Trash2 size={14} /> Delete Post
                </button>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-3">Category</label>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" value={cat} checked={form.category === cat}
                      onChange={e => set("category", e.target.value)} className="accent-[#0D1117]" />
                    <span className={`text-sm ${form.category === cat ? "text-[#0D1117] font-semibold" : "text-[#4A5568]"}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Tags</label>
              <textarea value={form.tags} onChange={e => set("tags", e.target.value)} rows={3}
                placeholder="root canal Tripunithura, painless treatment..."
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none resize-none text-xs transition-colors" />
              {suggested.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {suggested.map(tag => (
                    <button key={tag} type="button"
                      onClick={() => {
                        const cur = form.tags.split(",").map(t => t.trim()).filter(Boolean);
                        if (!cur.includes(tag)) set("tags", [...cur, tag].join(", "));
                      }}
                      className="text-[10px] bg-[#F4F7FA] border border-gray-200 text-[#4A5568] hover:border-[#0D1117] px-2 py-1 transition-colors">
                      + {tag}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Featured image */}
            <div className="bg-white shadow-sm p-6">
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#0D1117] mb-2">Featured Image URL</label>
              <input type="url" value={form.featuredImage} onChange={e => set("featuredImage", e.target.value)}
                placeholder="https://..."
                className="w-full border-2 border-gray-100 focus:border-[#0D1117] px-3 py-2.5 outline-none text-xs transition-colors" />
              {form.featuredImage && (
                <div className="mt-3 relative aspect-video overflow-hidden bg-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.featuredImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

