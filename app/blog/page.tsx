import { getPosts } from "@/lib/wordpress";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dental Health Blog – Tips from SmileCare Tripunithura",
  description:
    "Expert dental health tips, guides and news from our doctors in Tripunithura, Kerala.",
};

export default async function BlogPage() {
  const posts = await getPosts(9);

  return (
    <div className="min-h-screen bg-dental-light">
      <div className="bg-dental-dark text-white py-16 text-center">
        <h1 className="text-4xl font-bold mb-3">Dental Health Blog</h1>
        <p className="text-white/70">
          Tips, guides and news from our expert dentists
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="bg-gradient-to-br from-primary-50 to-dental-light h-48 flex items-center justify-center">
                <span className="text-6xl">🦷</span>
              </div>
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <h2
                  className="font-bold text-dental-dark text-lg mb-3 group-hover:text-primary-500 transition-colors"
                  dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                />
                <div
                  className="text-gray-500 text-sm leading-relaxed line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                />
                <span className="inline-block mt-4 text-primary-500 font-semibold text-sm">
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