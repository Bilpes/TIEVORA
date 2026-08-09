import "./globals.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "TIEVORA — CEO Command Center",
  description: "12 Agents • Global Offices • RAG Knowledge • Production Ready",
  manifest: "/manifest.json",
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0a0f1e"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0a0f1e] text-white antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
