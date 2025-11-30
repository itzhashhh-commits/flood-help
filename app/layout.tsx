import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import HelpDialog from "@/components/HelpDialog";
import BottomBar from "@/components/bottom-bar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Flood Help Map",
  description: "Ask for or offer flood assistance via a live map.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      >
        <div className="w-full h-dvh relative p-2 mb:p-3 flex flex-col ">
          <div className="my-3 mx-3 flex justify-between w-auto items-center">
            <h1 className=" font-semibold text-xl flex-1 ">
              <span className="font-normal">Flood</span> Help Map
            </h1>
            <HelpDialog />
          </div>
          <div className="rounded-xl w-full  flex-1 overflow-x-hidden overflow-y-auto">
            {children}
          </div>
          <BottomBar />
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
