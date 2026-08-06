import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const SITE_URL = "https://www.veecaredental.in";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Vee Care Dental Clinic – Best Dentist in Tripunithura, Ernakulam",
    template: "%s | Vee Care Dental Clinic",
  },
  description:
    "Vee Care Dental Clinic, Kandanad — trusted dental care in Tripunithura & Ernakulam. Root canal, dental implants, clear aligners, smile design & general dentistry. Evening & Sunday OP available. Book a free consultation.",
  keywords: [
    "dental clinic Tripunithura",
    "dentist Ernakulam",
    "root canal Tripunithura",
    "dental implants Kandanad",
    "clear aligners Tripunithura",
    "smile design Ernakulam",
    "best dental clinic Tripunithura",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "Vee Care Dental Clinic",
    title: "Vee Care Dental Clinic – Best Dentist in Tripunithura, Ernakulam",
    description:
      "Trusted dental care in Tripunithura & Ernakulam — root canal, implants, clear aligners, smile design. Evening & Sunday OP available.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vee Care Dental Clinic – Best Dentist in Tripunithura, Ernakulam",
    description:
      "Trusted dental care in Tripunithura & Ernakulam — root canal, implants, clear aligners, smile design.",
  },
  alternates: {
    canonical: SITE_URL,
  },
};

// LocalBusiness / Dentist structured data — this is what tells Google
// "this is a real local clinic" and directly powers the Maps/local-pack
// trust signals (rating stars in search results, knowledge panel, etc).
// Fill in the real phone/address/hours once confirmed — placeholders
// won't hurt anything, they just won't help until they're accurate.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Vee Care Dental Clinic",
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  telephone: "+91-8075243127",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Kandanad",
    addressLocality: "Tripunithura",
    addressRegion: "Kerala",
    addressCountry: "IN",
  },
  areaServed: ["Tripunithura", "Ernakulam", "Kandanad", "Kakkanad", "Kochi"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "09:00",
      closes: "14:00",
    },
  ],
  priceRange: "₹₹",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}