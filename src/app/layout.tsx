import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar";

import { LanguageProvider, LanguageFade } from "@/components/lang-context";
import { NavigationProvider } from "@/contexts/navigation-context";

// Function to generate iOS meta tags for status bar styling
function generateiOSMetaTags() {
  return {
    // iOS status bar appearance
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Alexis\' desktop',
    // Theme color for mobile browsers (matches navbar dark theme)
    'theme-color': '#080404',
    // Additional iOS meta tags
    'format-detection': 'telephone=no',
    'viewport': 'width=device-width, initial-scale=1, viewport-fit=cover',
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alexis' desktop",
  description: "Fullstack Developer | Building modern, fast, and accessible web experiences.",
  other: generateiOSMetaTags(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional iOS specific meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Alexis' desktop" />
        <meta name="theme-color" content="#080404" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        {/* iOS splash screen color */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        {/* Favicon */}
        <link rel="icon" href="/tags.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: '#080404' }}
      >
        <LanguageProvider>
          <NavigationProvider>
            <LanguageFade>
              <a id="top" />
              <Navbar />
              {children}
              {/* <Footer /> */}
            </LanguageFade>
          </NavigationProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
