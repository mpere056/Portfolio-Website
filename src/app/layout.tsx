import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import GlobalAudio from "@/components/GlobalAudio";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant'
});

export const metadata: Metadata = {
  title: "Mark's Portfolio",
  description: "A portfolio website for Mark.",
  icons: {
    icon: "/images/me_logo.png",
    shortcut: "/images/me_logo.png",
    apple: "/images/me_logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${cormorant.variable}`}>
        {children}
        <GlobalAudio />
      </body>
    </html>
  );
}
