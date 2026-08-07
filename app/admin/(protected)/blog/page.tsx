export const dynamic   = "force-dynamic";
export const revalidate = 0;

import { getAllPostsAdmin }  from "@/lib/blog";
import Link                 from "next/link";
import { PenSquare, Plus, Eye, Shield, Edit } from "lucide-react";
import DeletePostButton     from "@/components/admin/DeletePostButton";
import ToggleStatusButton   from "@/components/admin/ToggleStatusButton";

export default async function AdminBlogPage() {
  // Fetch ALL posts including drafts
  const posts = await getAllPostsAdmin();

  const published = posts.filter(p => p.status === "published");
  const drafts    = posts.filter(p => p.status === "draft");

  return (
    <div>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between">
        <h1 className="font-bold text-xl text-[#0D1117]">Blog Manager</h1>
        <Link href="/admin/blog/new"
          className="flex items-center gap-2 bg-[#C1583B] hover:bg-[#A3462C] text-white text-xs font-bold px-4 py-2 transition-colors">
          <Plus size={14} /> New Post
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-8 py-8">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white border-t-2 border-[#0D1117] p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">Total Posts</div>
            <div className="text-3xl font-bold text-[#0D1117]">{posts.length}</div>
          </div>
          <div className="bg-white border-t-2 border-green-500 p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">Published</div>
            <div className="text-3xl font-bold text-green-600">{published.length}</div>
          </div>
          <div className="bg-white border-t-2 border-yellow-400 p-5 shadow-sm">
            <div className="text-[#4A5568] text-xs font-medium uppercase tracking-wide mb-2">Drafts</div>
            <div className="text-3xl font-bold text-yellow-600">{drafts.length}</div>
          </div>
        </div>

        {/* Posts table */}
        <div className="bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0D1117] text-xs uppercase tracking-widest flex items-center gap-2">
              <PenSquare size={14} className="text-[#C1583B]" />
              All Blog Posts ({posts.length})
            </h3>
            <Link href="/admin/blog/new"
              className="flex items-center gap-2 bg-[#0D1117] hover:bg-[#C1583B] text-white text-xs font-bold px-4 py-2 transition-all">
              <Plus size={13} /> Write New Post
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <PenSquare size={40} className="mx-auto mb-3 text-gray-200" />
              <p className="font-medium text-[#0D1117]">No blog posts yet</p>
              <p className="text-sm text-[#4A5568] mt-1 mb-6">Write your first article to attract patients from Google</p>
              <Link href="/admin/blog/new"
                className="inline-flex items-center gap-2 bg-[#0D1117] text-white text-sm font-semibold px-6 py-3">
                <Plus size={15} /> Write First Post
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Title & URL","Category","Status","SEO","Published","Actions"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-[10px] font-bold tracking-widests uppercase text-[#4A5568] bg-[#F4F7FA] whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post, idx) => (
                    <tr key={post._id} className={`border-b border-gray-50 hover:bg-[#F4F7FA] transition-colors ${idx % 2 !== 0 ? "bg-[#FAFBFC]" : ""}`}>

                      {/* Title */}
                      <td className="px-5 py-4 max-w-[280px]">
                        <div className="font-semibold text-[#0D1117] text-sm truncate">{post.title}</div>
                        <div className="text-[#4A5568] text-xs mt-0.5 truncate text-gray-400">
                          /blog/{post.slug}
                        </div>
                        {post.excerpt && (
                          <div className="text-[10px] text-gray-400 mt-0.5 truncate max-w-[240px]">
                            {post.excerpt.replace(/<[^>]*>/g, "").slice(0, 80)}...
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="bg-[#0D1117]/5 text-[#0D1117] text-[10px] font-semibold px-2.5 py-1">
                          {post.category}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`text-[11px] font-bold px-2.5 py-1 ${
                          post.status === "published"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                        }`}>
                          {post.status === "published" ? "✓ Published" : "Draft"}
                        </span>
                      </td>

                      {/* SEO check */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1">
                          <div className={`text-[10px] flex items-center gap-1 ${post.seoTitle ? "text-green-600" : "text-red-400"}`}>
                            {post.seoTitle ? "✓" : "✗"} Title
                          </div>
                          <div className={`text-[10px] flex items-center gap-1 ${post.seoDescription ? "text-green-600" : "text-red-400"}`}>
                            {post.seoDescription ? "✓" : "✗"} Meta
                          </div>
                        </div>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span className="text-[#4A5568] text-xs">
                          {new Date(post.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2 flex-wrap">

                          {/* Edit */}
                          <Link href={`/admin/blog/${post._id}`}
                            className="flex items-center gap-1 bg-[#0D1117] hover:bg-[#C1583B] text-white text-[10px] font-bold px-2.5 py-1.5 transition-colors">
                            <Edit size={11} /> Edit
                          </Link>

                          {/* Toggle publish/draft */}
                          <ToggleStatusButton
                            id={post._id!}
                            currentStatus={post.status}
                          />

                          {/* View live — only for published */}
                          {post.status === "published" && (
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1.5 border border-blue-200 transition-colors">
                              <Eye size={11} /> View
                            </a>
                          )}

                          {/* Delete */}
                          <DeletePostButton id={post._id!} title={post.title} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SEO tip */}
        <div className="mt-6 bg-blue-50 border border-blue-100 p-5 flex items-start gap-3">
          <Shield size={16} className="text-blue-500 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-700">
            <strong>SEO Tip:</strong> Publish at least 1 article per week with keywords like
            "root canal Tripunithura" or "dental implants Ernakulam" to rank higher on Google.
            Each article is a new page Google can index.
          </div>
        </div>
      </div>
    </div>
  );
}

