"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

// The admin dashboard has its own header and its own printable pages
// (invoices, patient records) — it should never inherit the public
// site's Navbar, Footer, or floating WhatsApp bubble. Previously the
// root layout rendered those unconditionally on every route, which is
// why admin pages showed a stray duplicate logo (Navbar + the page's own
// letterhead) and why the floating "WhatsApp Us" bubble sat on top of
// invoice/record content, including when printing or saving as PDF.
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) return <>{children}</>;

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
