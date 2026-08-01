export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getPublishedPosts } from "@/lib/blog";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Health Blog – Vee Care Tripunithura",
  description: "Expert dental health tips and guides from our doctors in Tripunithura, Kerala.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-[#F2EDE3]">
      <div className="bg-[#0D1117] text-white py-16 text-center px-6">
        <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: "Georgia, serif" }}>
          Dental Health Blog
        </h1>
        <p className="text-white/60">Tips and guides from our expert dentists</p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#4A5568] text-lg">No articles published yet.</p>
            <p className="text-[#4A5568] text-sm mt-2">Check back soon for dental health tips.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {posts.map(post => (
              <Link
                key={post._id}
                href={`/blog/${post.slug}`}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
              >
                {/* Featured image or placeholder */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-[#F2EDE3]">
                  {post.featuredImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.featuredImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-5xl">🦷</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className="bg-[#0D1117] text-white text-[10px] font-bold px-3 py-1 tracking-wider uppercase">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-xs text-gray-400 mb-2">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric", month: "long", year: "numeric",
                    })}
                  </p>
                  <h2
                    className="font-bold text-[#0D1117] text-lg mb-3 group-hover:text-[#00A3E0] transition-colors leading-snug"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <div
                      className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4"
                      dangerouslySetInnerHTML={{ __html: post.excerpt }}
                    />
                  )}
                  <span className="text-[#00A3E0] font-semibold text-sm">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

