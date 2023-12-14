import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Koko notes",
  description: "This is a full stack note taking app",
  icons: "/favicon.svg",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
