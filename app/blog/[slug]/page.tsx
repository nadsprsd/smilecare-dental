export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getPost } from "@/lib/wordpress";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title:       post.title.rendered.replace(/<[^>]+>/g, ""),
    description: post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#F4F7FA] flex flex-col items-center justify-center px-6 text-center py-20">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl font-bold text-[#0D1117] mb-3"
          style={{ fontFamily: "Georgia, serif" }}>
          Article Not Found
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          This article may have been removed or the URL is incorrect.
        </p>
        <Link href="/blog"
          className="inline-flex items-center gap-2 bg-[#00A3E0] text-white font-semibold px-6 py-3 rounded-xl">
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-[#0D1117] py-16 text-center px-6">
        <div className="max-w-3xl mx-auto">
          <p className="text-[#C9A96E] text-xs font-bold tracking-widest uppercase mb-4">
            SmileCare Blog
          </p>
          <h1
            className="text-2xl md:text-4xl font-bold text-white leading-snug mb-5"
            style={{ fontFamily: "Georgia, serif" }}
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
          <div className="flex items-center justify-center gap-2 text-white/50 text-xs">
            <Calendar size={12} />
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link href="/blog"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00A3E0] text-sm mb-10 transition-colors">
          <ArrowLeft size={15} /> Back to Blog
        </Link>

        <div
          className="
            [&>p]:text-gray-600 [&>p]:leading-relaxed [&>p]:mb-5 [&>p]:text-base
            [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:text-[#0D1117] [&>h2]:mt-8 [&>h2]:mb-4
            [&>h3]:text-xl [&>h3]:font-bold [&>h3]:text-[#0D1117] [&>h3]:mt-6 [&>h3]:mb-3
            [&>ul]:text-gray-600 [&>ul]:mb-5 [&>ul]:pl-6 [&>ul]:space-y-2
            [&>ol]:text-gray-600 [&>ol]:mb-5 [&>ol]:pl-6 [&>ol]:space-y-2
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#C9A96E] [&>blockquote]:pl-5 [&>blockquote]:italic [&>blockquote]:text-gray-500 [&>blockquote]:my-6
          "
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </div>

      {/* CTA */}
      <div className="max-w-3xl mx-auto px-6 pb-16">
        <div className="bg-[#0D1117] rounded-2xl p-8 text-center text-white">
          <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Have Questions? Talk to Our Dentist.
          </h3>
          <p className="text-white/60 mb-6 text-sm">Free consultation at SmileCare, Tripunithura.</p>
          <Link href="/appointment"
            className="inline-flex items-center gap-2 bg-[#C9A96E] hover:bg-[#b8935a] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors">
            Book Free Consultation <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}