import type { Metadata } from "next";
import GoogleReviews from "@/components/GoogleReviews";

export const metadata: Metadata = {
  title: "Patient Reviews – Vee Care Dental Clinic Tripunithura",
  description:
    "Read real Google reviews from Vee Care Dental Clinic patients in Tripunithura, Ernakulam. See why patients trust us for root canal, implants, aligners and smile design.",
};

export default function ReviewsPage() {
  return (
    <div className="pt-32 pb-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-4">
        <span className="gold-rule mx-auto" />
        <span className="label-text block mb-4">Patient Reviews</span>
        <h1 className="display-text text-[#0D1117]" style={{ fontSize: "clamp(2.2rem, 4vw, 3.5rem)" }}>
          Real Reviews,
          <br />
          <span className="italic text-[#C1583B]">Straight From Google.</span>
        </h1>
      </div>
      <GoogleReviews variant="full" />
    </div>
  );
}
