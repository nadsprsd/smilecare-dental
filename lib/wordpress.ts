const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://demo-wp.vercel.app";

export interface WPPost {
  id: number;
  slug: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  date: string;
  featured_media: number;
  _embedded?: {
    "wp:featuredmedia"?: Array<{ source_url: string; alt_text: string }>;
  };
}

export interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
}

export async function getPosts(perPage = 6): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=${perPage}&_embed`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return getMockPosts();
    return res.json();
  } catch {
    return getMockPosts();
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch {
    return null;
  }
}

// Mock data so the site works even before WP is connected
function getMockPosts(): WPPost[] {
  return [
    {
      id: 1,
      slug: "how-to-care-for-your-teeth",
      title: { rendered: "10 Tips for Healthy Teeth & Gums" },
      excerpt: {
        rendered:
          "<p>Good oral hygiene starts at home. Learn the best practices recommended by our dentists in Tripunithura.</p>",
      },
      content: { rendered: "<p>Full article content here...</p>" },
      date: "2025-04-01T10:00:00",
      featured_media: 0,
    },
    {
      id: 2,
      slug: "dental-implants-guide",
      title: { rendered: "Complete Guide to Dental Implants in Kerala" },
      excerpt: {
        rendered:
          "<p>Dental implants are the gold standard for missing teeth. Here's what you need to know before booking.</p>",
      },
      content: { rendered: "<p>Full article content here...</p>" },
      date: "2025-03-15T10:00:00",
      featured_media: 0,
    },
    {
      id: 3,
      slug: "teeth-whitening-facts",
      title: { rendered: "Teeth Whitening: Myths vs Facts" },
      excerpt: {
        rendered:
          "<p>Many patients ask us about teeth whitening. We separate the facts from the fiction.</p>",
      },
      content: { rendered: "<p>Full article content here...</p>" },
      date: "2025-02-20T10:00:00",
      featured_media: 0,
    },
  ];
}