import "./globals.css";
import SiteFrame from "@/components/SiteFrame";

export const metadata = { title: "RigRent | Equipment rental, made simple", description: "Find and rent verified equipment from local owners." };

export default function RootLayout({ children }) {
  return <html lang="en"><body><SiteFrame>{children}</SiteFrame></body></html>;
}
