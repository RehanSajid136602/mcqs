import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import EarlyDevPopup from "@/components/EarlyDevPopup";
import Sidebar from "@/components/Sidebar";
import { SidebarProvider } from "@/components/providers/SidebarProvider";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MCQ Master — HSSC-2 Practice",
  description: "Pakistan FBISE HSSC-2 board exam MCQ practice platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-[--bg] text-[--text] font-sans antialiased">
        <SidebarProvider>
          <div className="flex min-h-[100dvh]">
            <Sidebar />
            <main className="flex-1 ml-0 lg:ml-[260px] transition-all duration-300">
              {children}
            </main>
          </div>
        </SidebarProvider>
        <EarlyDevPopup />
      </body>
    </html>
  );
}
