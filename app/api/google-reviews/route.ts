// app/api/google-reviews/route.ts
//
// Fetches live reviews from the clinic's Google Business Profile via the
// Google Places API (Place Details). Requires two env vars — see README below.
//
// IMPORTANT LIMITATION: Google's Place Details endpoint only returns up to
// 5 reviews (the ones Google considers "most relevant"), not the full list.
// This is a Google API limitation, not something we can code around. It's
// enough for a homepage preview + a solid /reviews page, but if the clinic
// wants every single review shown, a third-party widget (e.g. Elfsight,
// Trustmary) is the only way to pull the complete review history — those
// services scrape/sync the full set instead of using this capped endpoint.
//
// Setup:
// 1. Get an API key: https://console.cloud.google.com/ → enable "Places API"
// 2. Find the Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id
//    (search "Vee Care Dental Clinic Tripunithura" on that tool)
// 3. Add to .env.local (never commit this file):
//      GOOGLE_PLACES_API_KEY=your_key_here
//      GOOGLE_PLACE_ID=the_place_id_here

export const revalidate = 3600; // cache for 1 hour — reviews don't need to be real-time

interface GooglePlaceReview {
  author_name: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number; // unix timestamp
  profile_photo_url?: string;
}

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return Response.json(
      {
        success: false,
        message:
          "Google Places API not configured yet. Set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in .env.local.",
      },
      { status: 200 } // 200 so the frontend can show a graceful fallback, not a crash
    );
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,user_ratings_total,reviews,url&key=${apiKey}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const data = await res.json();

    if (data.status !== "OK") {
      return Response.json(
        { success: false, message: `Google API error: ${data.status}` },
        { status: 200 }
      );
    }

    const reviews: GooglePlaceReview[] = data.result?.reviews ?? [];

    return Response.json({
      success: true,
      rating: data.result?.rating ?? null,
      totalReviews: data.result?.user_ratings_total ?? null,
      googleUrl: data.result?.url ?? null,
      reviews: reviews.map((r) => ({
        name: r.author_name,
        rating: r.rating,
        date: r.relative_time_description,
        text: r.text,
        photo: r.profile_photo_url ?? null,
      })),
    });
  } catch (err) {
    return Response.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 200 }
    );
  }
}
