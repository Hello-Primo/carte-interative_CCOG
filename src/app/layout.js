import { Geist, Geist_Mono } from "next/font/google";
import "leaflet/dist/leaflet.css";
import "./globals.css";
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Carte Interactive CCOG",
  description: "Carte Interactive CCOG",
};

export default function RootLayout({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.storage?.persist) {
      navigator.storage.persist().then((granted) => {
        if (granted) {
          console.log(
            "Stockage persistant accordé : les tuiles et le cache seront moins susceptibles d'être effacés."
          );
        } else {
          console.log("Stockage persistant refusé ou non supporté.");
        }
      });
    }
  }, []);

  return (
    <html lang="fr">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1976d2" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
