import type { Metadata } from "next";
import {
  Comic_Neue,
  Fredoka,
  Geist,
  Geist_Mono,
  Quicksand,
} from "next/font/google";
import ClientInit from "./_components/ClientInit";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const comicNeue = Comic_Neue({
  variable: "--font-comic-neue",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Mon Histoire à Moi | Histoires personnalisées pour enfants",
  description: "Créez des histoires personnalisées pour vos enfants avec l'IA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${fredoka.variable} ${quicksand.variable} ${comicNeue.variable} antialiased font-quicksand`}
      >
        <ClientInit />
        {children}
      </body>
    </html>
  );
}
