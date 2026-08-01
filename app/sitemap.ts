import type { MetadataRoute } from "next";
import { SERVICES } from "@/lib/services";

const SITE_URL = "https://www.veecaredental.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "", "about", "services", "doctors", "gallery",
    "reviews", "contact", "appointment", "blog", "privacy", "terms",
  ].map((path) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: new Date(),
  }));

  const servicePages = SERVICES.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...servicePages];
}
