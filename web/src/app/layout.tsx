import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { copy } from "@/lib/copy";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: copy.app.metadataTitle,
  description: copy.app.metadataDescription,
  icons: {
    icon: [
      { url: "/favicon.ico?v=0.8.1", sizes: "any" },
      { url: "/icon.png?v=0.8.1", type: "image/png", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico?v=0.8.1",
    apple: "/icon.png?v=0.8.1",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* Workspace data lives in an external store (`lib/store`), so there is
            no provider to mount — screens subscribe with `useWorkspace()`. */}
        <TooltipProvider>{children}</TooltipProvider>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
