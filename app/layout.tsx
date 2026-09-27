import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agento — Responsive Product Prototype",
  description: "Mobile-first responsive reference for Agento authentication, subscriptions, leads, and properties.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ka">
      <body>{children}</body>
    </html>
  );
}
