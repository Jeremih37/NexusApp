import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NexusApp - Descubre, Evalúa y Descarga Videojuegos",
  description: "Tu plataforma para descubrir videojuegos, leer reseñas, ver trailers y encontrar enlaces de descarga. Explora, califica y comparte tus juegos favoritos.",
  keywords: ["NexusApp", "videojuegos", "reseñas", "trailers", "descargas", "juegos", "gaming"],
  authors: [{ name: "NexusApp" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-950 text-white`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
