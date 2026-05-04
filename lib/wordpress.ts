const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://demo-dental.bizgrowonline.com";

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

export async function getPosts(perPage = 6): Promise<WPPost[]> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?per_page=${perPage}&_embed`,
      { cache: "no-store" }
    );
    if (!res.ok) return getMockPosts();
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return getMockPosts();
    return data;
  } catch {
    return getMockPosts();
  }
}

export async function getPost(slug: string): Promise<WPPost | null> {
  try {
    const res = await fetch(
      `${WP_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const posts = await res.json();
    return posts[0] || null;
  } catch {
    return null;
  }
}

// Updated mock posts — slugs match real WordPress posts
function getMockPosts(): WPPost[] {
  return [
    {
      id: 7,
      slug: "10-habits-for-healthy-teeth-your-dentist-recommends",
      title: { rendered: "10 Habits for Healthy Teeth Your Dentist Recommends" },
      excerpt: { rendered: "<p>Good oral hygiene starts at home. Learn the proven habits our dentists in Tripunithura recommend.</p>" },
      content: { rendered: "<p>Brush twice daily, floss every day, and visit your dentist every 6 months.</p>" },
      date: "2026-05-04T12:53:40",
      featured_media: 0,
    },
    {
      id: 10,
      slug: "dental-implants-vs-dentures-which-is-right-for-you",
      title: { rendered: "Dental Implants vs Dentures — Which is Right for You?" },
      excerpt: { rendered: "<p>Both replace missing teeth but in very different ways. Here is how to choose the right solution.</p>" },
      content: { rendered: "<p>Dental implants are permanent and feel like natural teeth. Dentures are removable and more affordable.</p>" },
      date: "2026-05-04T12:54:16",
      featured_media: 0,
    },
    {
      id: 12,
      slug: "teeth-whitening-what-actually-works-and-what-doesnt",
      title: { rendered: "Teeth Whitening — What Actually Works and What Doesn't" },
      excerpt: { rendered: "<p>With so many whitening options available, it can be confusing to know what actually works.</p>" },
      content: { rendered: "<p>Professional teeth whitening performed by a dentist is the most effective method.</p>" },
      date: "2026-05-04T12:54:44",
      featured_media: 0,
    },
  ];
}