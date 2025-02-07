import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster"
import { CartProvider } from '@/contexts/CardContext'
import {
  ClerkProvider,
} from '@clerk/nextjs'
import { UserProvider } from "@/contexts/UserContext";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SHOP.CO",
  description: "Get all what you need.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <UserProvider>
            <CartProvider>
              {children}
              <Toaster />
            </CartProvider>
          </UserProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
