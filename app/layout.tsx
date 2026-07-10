import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GuideLearn — Always By Your Side",
    template: "%s | GuideLearn",
  },
  description:
    "A character-led learning platform where your personal guide accompanies you through every lesson, module, and quiz.",
  keywords: ["learning", "LMS", "guided learning", "online courses", "education"],
  openGraph: {
    title: "GuideLearn",
    description: "Your AI-powered guided learning platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head />
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
