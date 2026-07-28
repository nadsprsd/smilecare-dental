// lib/blog.ts
// Blog helper functions — reads/writes from MongoDB "posts" collection

import { connectDB } from "@/lib/mongodb";
import { ObjectId }  from "mongodb";

export interface BlogPost {
  _id?:            string;
  title:           string;
  slug:            string;
  excerpt:         string;
  content:         string;
  category:        string;
  seoTitle:        string;
  seoDescription:  string;
  featuredImage:   string;
  status:          "published" | "draft";
  createdAt:       string;
  updatedAt:       string;
}

// Generate URL-friendly slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Get all published posts (for /blog page)
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const db   = await connectDB();
    const docs = await db
      .collection("posts")
      .find({ status: "published" })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(d => ({
      ...d,
      _id: d._id.toString(),
    })) as BlogPost[];
  } catch {
    return [];
  }
}

// Get single post by slug (for /blog/[slug] page)
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const db  = await connectDB();
    const doc = await db.collection("posts").findOne({ slug, status: "published" });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as BlogPost;
  } catch {
    return null;
  }
}

// Get ALL posts including drafts (for admin)
export async function getAllPostsAdmin(): Promise<BlogPost[]> {
  try {
    const db   = await connectDB();
    const docs = await db
      .collection("posts")
      .find()
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map(d => ({
      ...d,
      _id: d._id.toString(),
    })) as BlogPost[];
  } catch {
    return [];
  }
}

// Get single post by ID (for admin edit)
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const db  = await connectDB();
    const doc = await db.collection("posts").findOne({ _id: new ObjectId(id) });
    if (!doc) return null;
    return { ...doc, _id: doc._id.toString() } as BlogPost;
  } catch {
    return null;
  }
}

export const CATEGORIES = [
  "Oral Health",
  "Cosmetic Dentistry",
  "Dental Implants",
  "Orthodontics",
  "Kids Dentistry",
  "Preventive Care",
  "Clinic News",
  "Patient Stories",
];

