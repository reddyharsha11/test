import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { Home, FolderKanban, Mail } from "lucide-react";

// Portfolio Themes (Matching the builder)
const THEMES = {
  minimalist: { bg: "bg-white text-gray-900", card: "bg-gray-50 border border-gray-100", accent: "text-gray-900", font: "font-sans", nav: "bg-white/80" },
  cyberpunk: { bg: "bg-black text-[#00ff41]", card: "bg-[#0d0d0d] border border-[#00ff41]", accent: "text-[#ff003c]", font: "font-mono", nav: "bg-black/80 border-b border-[#00ff41]" },
  neoBrutalism: { bg: "bg-[#f4e04d] text-black", card: "bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]", accent: "text-blue-600", font: "font-sans font-black", nav: "bg-[#f4e04d] border-b-4 border-black" },
  elegant: { bg: "bg-stone-900 text-stone-100", card: "bg-stone-800 border border-stone-700", accent: "text-amber-500", font: "font-serif", nav: "bg-stone-900/80 border-b border-stone-800" },
  developer: { bg: "bg-[#1e1e1e] text-[#d4d4d4]", card: "bg-[#2d2d2d] border border-[#404040]", accent: "text-[#569cd6]", font: "font-mono", nav: "bg-[#1e1e1e]/90 border-b border-[#333]" },
};

type ThemeKey = keyof typeof THEMES;

// Client component for the tabs logic
import { PublicPortfolioViewer } from "./PublicPortfolioViewer";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { id } = await params;

  await dbConnect();
  
  // Find the published portfolio by userId
  const portfolio = await Portfolio.findOne({ userId: id, isPublished: true }).lean();

  if (!portfolio) {
    notFound();
  }

  // Convert MongoDB document to plain object
  const portfolioData = {
    name: portfolio.name,
    college: portfolio.college,
    skills: portfolio.skills,
    contact: portfolio.contact,
    theme: portfolio.theme as ThemeKey,
    projects: portfolio.projects || [],
  };

  return <PublicPortfolioViewer portfolio={portfolioData} themes={THEMES} />;
}
