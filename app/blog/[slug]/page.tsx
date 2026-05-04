import { getPost, getPosts } from "@/lib/wordpress";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const posts = await getPosts(20);
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title.rendered,
    description: post.excerpt.rendered.replace(/<[^>]+>/g, "").slice(0, 160),
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-dental-dark text-white py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="text-white/60 text-sm mb-3">
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 py-12">
        <div
          className="prose prose-lg max-w-none prose-headings:text-dental-dark prose-a:text-primary-500"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>

      <div className="max-w-3xl mx-auto px-4 pb-12">
        <div className="bg-primary-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-dental-dark mb-3">
            Need a Dental Appointment?
          </h3>
          <p className="text-gray-500 mb-6">
            Our expert dentists in Tripunithura are ready to help you.
          </p>
          <Link href="/appointment" className="btn-primary">
            Book Free Consultation
          </Link>
        </div>
      </div>

      <div className="text-center py-6">
        <Link href="/blog" className="text-primary-500 hover:underline">
          ← Back to Blog
        </Link>
      </div>
    </div>
  );
}