import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "IntroText AI",
  description: "Never get stuck on what to say.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
