import type { Metadata, Viewport } from "next";
import Image from "next/image";
import Link from "next/link";
import Providers from "./providers";
import "./globals.css";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Wishlink — Commission Comparison for Creators",
  description: "Compare affiliate commissions across Amazon, Flipkart & Meesho. Find the highest payout products to promote and earn more as a content creator.",
  keywords: "affiliate marketing, commission comparison, creator earnings, Amazon affiliate, Flipkart affiliate, Meesho affiliate, Wishlink",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-100">
      <body className="min-h-screen text-gray-900 font-sans flex justify-center bg-[#f0f0f0]">
        <Providers>
          <div className="mobile-wrapper flex flex-col w-full bg-white">
            {/* Header — Wishlink orange */}
            <header className="sticky top-0 z-50 bg-[#EE4D37] shadow-sm shrink-0">
              <div className="px-3 py-2.5 flex items-center justify-between">
                <Link href="/" className="flex items-center">
                  <Image
                    src="/images/wishlink_logo.png"
                    alt="Wishlink"
                    width={110}
                    height={28}
                    className="object-contain w-[100px]"
                    priority
                  />
                </Link>
              </div>
            </header>

            {/* Main Content */}
            <main className="bg-[#f8f8f8] flex-1">{children}</main>

            {/* Footer */}
            <footer className="bg-[#3d3d3d] text-white/60 py-6 shrink-0 mt-auto">
              <div className="px-4">
                <div className="flex flex-col items-center justify-center gap-3">
                  <Image
                    src="/images/wishlink_logo.png"
                    alt="Wishlink"
                    width={90}
                    height={22}
                    className="object-contain opacity-60 w-[80px]"
                  />
                  <p className="text-[11px] text-center">
                    Commission rates are updated regularly. Actual rates may vary.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
