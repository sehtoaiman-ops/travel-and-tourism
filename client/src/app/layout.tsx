import type { Metadata } from "next";
import { Playfair_Display, Poppins, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/shared/Providers";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "EcoVoyage Luxury | Sustainable Luxury Eco-Tourism",
  description: "Experience premium, sustainable eco-tourism. Explore zero-carbon luxury safaris, solar alpine retreats, rainforest canopy eco-resorts, and carbon-neutral adventures around the globe.",
  keywords: ["eco-tourism", "luxury travel", "sustainable travel", "carbon neutral", "eco resorts", "wildlife expedition"],
  openGraph: {
    title: "EcoVoyage Luxury | Premium Sustainable Journeys",
    description: "Discover curated travel adventures that neutralize carbon footprint and directly sustain local communities.",
    url: "https://ecovoyage.luxury",
    siteName: "EcoVoyage Luxury",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200",
        width: 1200,
        height: 630,
        alt: "EcoVoyage Luxury Canopy Tour",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EcoVoyage Luxury Travel",
    description: "Luxury eco-resorts and low-carbon wildlife adventures.",
    images: ["https://images.unsplash.com/photo-1542401886-65d6c61db217?w=1200"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-charcoal font-sans selection:bg-gold selection:text-white">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
