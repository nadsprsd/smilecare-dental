import { getPosts } from "@/lib/wordpress";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Health Blog – SmileCare Tripunithura",
  description: "Expert dental health tips and guides from our doctors in Tripunithura, Kerala.",
};

export default async function BlogPage() {
  const posts = await getPosts(9);

  return (
    <div className="min-h-screen bg-[#F4F7FA]">
      <div className="bg-[#0D1117] text-white py-16 text-center">
        <h1
          className="text-4xl font-bold mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Dental Health Blog
        </h1>
        <p className="text-white/60">
          Tips, guides and news from our expert dentists
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group"
            >
              <div className="bg-gradient-to-br from-blue-50 to-[#F4F7FA] h-48 flex items-center justify-center">
                <span className="text-5xl">🦷</span>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <h2
                  className="font-bold text-[#0D1117] text-lg mb-3 group-hover:text-[#00A3E0] transition-colors"
                  style={{ fontFamily: "Georgia, serif" }}
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div
                  className="text-gray-500 text-sm leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <span className="inline-block mt-4 text-[#00A3E0] font-semibold text-sm">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}