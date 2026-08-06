import { cookies }  from "next/headers";
import { redirect } from "next/navigation";
import BookingsList from "@/components/BookingsList";

async function checkAuth() {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "authenticated") redirect("/admin/login");
}

export default async function BookingsPage() {
  await checkAuth();
  return <BookingsList />;
}
