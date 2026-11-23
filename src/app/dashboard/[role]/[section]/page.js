import { redirect } from "next/navigation";
const sectionAnchors = { rentals: "rentals", favorites: "favorites", "add-equipment": "add-equipment", "my-equipment": "my-equipment", users: "users", equipment: "approvals", profile: "profile" };
export default async function DashboardSectionPage({ params }) { const { section } = await params; if (section === "profile") redirect("/profile"); redirect(`/dashboard#${sectionAnchors[section] || "top"}`); }
