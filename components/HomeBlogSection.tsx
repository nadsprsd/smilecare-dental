import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPublishedPosts } from "@/lib/blog";

export default async function HomeBlogSection() {
  const posts = await getPublishedPosts();
  const latest = posts.slice(0, 3);

  if (latest.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 bg-[#F4F7FA]">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <span className="text-[#C1583B] text-[10px] font-bold tracking-widest uppercase block mb-3">
              Dental Health Tips
            </span>
            <div className="w-10 h-0.5 bg-[#C1583B] mb-5" />
            <h2
              className="text-[#0D1117] font-bold"
              style={{ fontFamily: "Georgia, serif", fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
            >
              From Our
              <br />
              <span className="italic text-[#00A3E0]">Dental Experts.</span>
            </h2>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-[#0D1117] text-[#0D1117] hover:bg-[#0D1117] hover:text-white font-semibold px-5 py-2.5 text-sm transition-all self-start"
          >
            All Articles <ArrowRight size={14} />
          </Link>
        </div>

        {/* Posts grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {latest.map((post, idx) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="bg-white group hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-[#F4F7FA]">
                {post.featuredImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl opacity-30">🦷</span>
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#0D1117] text-white text-[10px] font-bold px-2.5 py-1 tracking-wider uppercase">
                    {post.category}
                  </span>
                </div>
                {idx === 0 && (
                  <div className="absolute top-3 right-3">
                    <span className="bg-[#C1583B] text-[#0D1117] text-[10px] font-bold px-2.5 py-1">
                      Latest
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-xs text-gray-400 mb-2">
                  {new Date(post.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric", month: "long", year: "numeric",
                  })}
                </p>
                <h3
                  className="font-bold text-[#0D1117] text-lg mb-3 group-hover:text-[#00A3E0] transition-colors leading-snug line-clamp-2"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">
                    {post.excerpt.replace(/<[^>]*>/g, "")}
                  </p>
                )}
                <span className="text-[#00A3E0] font-semibold text-sm flex items-center gap-1">
                  Read Article <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

