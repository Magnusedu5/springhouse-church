import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import ConditionalChrome from "@/components/ConditionalChrome";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "The SpringHouse Church | Across the street, across the seas!",
  description:
    "To bring the lost to the saving knowledge of Christ and to mature believers who will minister across the seas.",
  openGraph: {
    title: "The SpringHouse Church | Across the street, across the seas!",
    description:
      "To bring the lost to the saving knowledge of Christ and to mature believers who will minister across the seas.",
    siteName: "The SpringHouse Church",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${cormorant.variable} ${dmSans.variable} font-sans antialiased`}>
        <ConditionalChrome>{children}</ConditionalChrome>
      </body>
    </html>
  );
}
