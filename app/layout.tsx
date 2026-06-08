import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PublicLayout } from "@/components/layout/PublicLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Your Dealer | Premium Used Cars & Japanese Imports",
    template: "%s | Your Dealer",
  },
  description: "Family operated used car dealership specialising in quality vehicles and Japanese imports. Browse our inventory or get a free import quote today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PublicLayout>{children}</PublicLayout>
      </body>
    </html>
  );
}
