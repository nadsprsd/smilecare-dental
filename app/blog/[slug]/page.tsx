export const dynamic    = "force-dynamic";
export const revalidate = 0;

import { getPostBySlug } from "@/lib/blog";
import Link              from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title:       post.seoTitle       || post.title,
    description: post.seoDescription || (post.excerpt || "").replace(/<[^>]*>/g, ""),
  };
}

// ── Clean up editor HTML before displaying ──
function cleanContent(html: string): string {
  return html
    // Remove empty paragraphs with only <br> or zero-width spaces
    .replace(/<p>(<br>|<br\/>|&nbsp;|\u200B)*<\/p>/gi, "")
    // Remove consecutive <br> tags
    .replace(/(<br\s*\/?>){3,}/gi, "<br>")
    // Fix broken img tags that show as text
    .replace(/\[Article image\]/gi, "")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    // Clean empty divs
    .replace(/<div>\s*<\/div>/gi, "")
    .trim();
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post     = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl font-bold text-[#0D1117] mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Article Not Found
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          This article may have been removed or the URL is incorrect.
        </p>
        <Link href="/blog"
          className="inline-flex items-center gap-2 bg-[#00A3E0] text-white font-semibold px-6 py-3">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  const cleanedContent = cleanContent(post.content || "");

  return (
    <div className="min-h-screen bg-white">

      {/* ── Header ── */}
      <div className="bg-[#0D1117] py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-4">
            {post.category}
          </p>
          <h1
            className="text-2xl md:text-4xl font-bold text-white leading-snug mb-5"
            style={{ fontFamily: "Georgia, serif" }}
          >
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
            <Calendar size={12} />
            {new Date(post.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* ── Featured image ── */}
      {post.featuredImage && (
        <div className="max-w-3xl mx-auto px-6 mt-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full rounded-lg object-cover"
            style={{ maxHeight: "420px" }}
            onError={undefined}
          />
        </div>
      )}

      {/* ── Excerpt ── */}
      {post.excerpt && (
        <div className="max-w-3xl mx-auto px-6 mt-8">
          <p className="text-gray-500 text-base italic border-l-4 border-[#C9A96E] pl-4 py-1">
            {post.excerpt.replace(/<[^>]*>/g, "")}
          </p>
        </div>
      )}

      {/* ── Back link ── */}
      <div className="max-w-3xl mx-auto px-6 mt-6">
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00A3E0] text-sm transition-colors">
          <ArrowLeft size={14} /> Back to Blog
        </Link>
      </div>

      {/* ── Article content ── */}
      <article className="max-w-3xl mx-auto px-6 py-8">
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: cleanedContent }}
        />
      </article>

      {/* ── Tags ── */}
      {post.tags && post.tags.length > 0 && (
        <div className="max-w-3xl mx-auto px-6 pb-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <span key={tag}
                className="text-xs bg-[#F4F7FA] border border-gray-200 text-gray-500 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-[#0D1117] p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Have Questions? Talk to Our Dentist.
          </h3>
          <p className="text-white/60 mb-6 text-sm">Free consultation at our clinic. No obligation.</p>
          <Link
            href="/appointment"
            className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-white font-semibold px-8 py-3.5 transition-colors"
          >
            Book Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* ── Blog content styles ── */}
      <style>{`
        .blog-content                { font-size: 16px; line-height: 1.85; color: #374151; }
        .blog-content > * + *        { margin-top: 16px; }
        .blog-content p              { margin: 0 0 16px; }
        .blog-content p:empty        { display: none; }
        .blog-content br + br        { display: none; }
        .blog-content h2             { font-size: 1.6em; font-weight: 700; color: #0D1117; margin: 36px 0 12px; font-family: Georgia, serif; line-height: 1.3; }
        .blog-content h3             { font-size: 1.3em; font-weight: 700; color: #0D1117; margin: 28px 0 10px; }
        .blog-content h4             { font-size: 1.1em; font-weight: 600; color: #0D1117; margin: 20px 0 8px; }
        .blog-content ul             { list-style: disc; padding-left: 28px; margin: 0 0 18px; }
        .blog-content ol             { list-style: decimal; padding-left: 28px; margin: 0 0 18px; }
        .blog-content li             { margin: 6px 0; line-height: 1.75; color: #374151; }
        .blog-content li p           { margin: 0; }
        .blog-content blockquote     { border-left: 4px solid #C9A96E; padding: 12px 20px; margin: 20px 0; color: #555; font-style: italic; background: #fffbf5; border-radius: 0 6px 6px 0; }
        .blog-content hr             { border: none; border-top: 2px solid #e5e7eb; margin: 28px 0; }
        .blog-content a              { color: #00A3E0; text-decoration: underline; }
        .blog-content a:hover        { color: #0084b8; }
        .blog-content img            { max-width: 100%; height: auto; border-radius: 8px; margin: 20px auto; display: block; }
        .blog-content strong         { font-weight: 700; color: #0D1117; }
        .blog-content em             { font-style: italic; }
        .blog-content div            { margin: 12px 0; }

        /* Fix: remove extra whitespace at bottom */
        .blog-content > p:last-child:empty  { display: none; }
        .blog-content > br:last-child       { display: none; }
      `}</style>
    </div>
  );
}

