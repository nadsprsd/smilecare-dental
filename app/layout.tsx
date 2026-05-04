import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export const metadata: Metadata = {
  title: {
    default: "SmileCare Dental Clinic – Tripunithura, Kerala",
    template: "%s | SmileCare Dental Clinic",
  },
  description:
    "Best dental clinic in Tripunithura. Teeth whitening, implants, braces & more.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://smilecare.in",
    siteName: "SmileCare Dental Clinic",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}