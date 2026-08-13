import type { Metadata } from "next";
import Script from "next/script";
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
    "Vee Care Dental Clinic, Udayamperoor — trusted dental care in Tripunithura & Ernakulam. Root canal, dental implants, clear aligners, smile design & general dentistry. Evening & Sunday OP available. Book a free consultation.",
  keywords: [
    "dental clinic Tripunithura",
    "dentist Ernakulam",
    "root canal Tripunithura",
    "dental implants Udayamperoor",
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
  // Google Search Console verification — the simplest method, no DNS or
  // file upload needed. Add NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to your
  // .env.local (and Vercel's env vars) with the code Search Console gives
  // you, and this renders the required meta tag automatically. Leave unset
  // and it just doesn't render anything — safe either way.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

// LocalBusiness / Dentist structured data — this is what tells Google
// "this is a real local clinic" and directly powers the Maps/local-pack
// trust signals (rating stars in search results, knowledge panel, etc).
// This MUST match the clinic's real, current address exactly — mismatched
// address data actively hurts local SEO rather than just doing nothing.
const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "Vee Care Dental Clinic",
  image: `${SITE_URL}/og-image.jpg`,
  url: SITE_URL,
  telephone: "+91-8075243127",
  address: {
    "@type": "PostalAddress",
    streetAddress: "R M Arcade, Vaikom Road",
    addressLocality: "Udayamperoor",
    addressRegion: "Kerala",
    postalCode: "682307",
    addressCountry: "IN",
  },
  areaServed: ["Tripunithura", "Ernakulam", "Udayamperoor", "Kakkanad", "Kochi"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "10:00",
      closes: "20:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Sunday",
      opens: "10:00",
      closes: "16:00",
    },
  ],
  priceRange: "₹₹",
};

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

        {/* Google Analytics (GA4) — only loads if NEXT_PUBLIC_GA_MEASUREMENT_ID
            is set in your env vars. Get this from analytics.google.com after
            creating a GA4 property for the site (format: G-XXXXXXXXXX). */}
        {GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}

        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}