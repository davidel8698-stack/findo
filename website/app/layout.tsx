import type { Metadata, Viewport } from "next";
import { Heebo } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew"],
  display: "swap",
  weight: ["400", "500", "700"],
  variable: "--font-heebo",
  fallback: ["Arial", "sans-serif"],
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: "Findo - Automatic Business Growth",
  description: "Autonomous lead capture, review management, and Google Business Profile optimization for Israeli SMBs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={`${heebo.className} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
