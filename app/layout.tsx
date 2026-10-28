import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";

export const metadata: Metadata = {
  title: "DemandBase — Turn an overdue invoice into a clear next step",
  description:
    "Create a polished, professional demand letter with guided prompts, a live preview, and instant PDF export.",
  keywords: ["demand letter", "overdue invoice", "freelancer", "contractor", "invoice recovery"],
};

export const viewport: Viewport = {
  themeColor: "#050706",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
