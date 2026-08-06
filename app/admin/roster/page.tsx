import { cookies }  from "next/headers";
import { redirect } from "next/navigation";
import RosterGrid   from "@/components/RosterGrid";

async function checkAuth() {
  const c = await cookies();
  if (c.get("admin_session")?.value !== "authenticated") redirect("/admin/login");
}

export default async function RosterPage() {
  await checkAuth();
  return <RosterGrid />;
}
