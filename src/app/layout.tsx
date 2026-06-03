import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClientToaster } from "@/components/client-toaster";
import { QueryProvider } from "@/lib/query-provider";

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
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        suppressHydrationWarning
      >
        <QueryProvider>
          {children}
        </QueryProvider>
        <ClientToaster />
      </body>
    </html>
  );
}
