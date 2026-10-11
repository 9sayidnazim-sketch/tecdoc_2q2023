import type { Metadata } from "next";
import "./globals.css";
import { I18nProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Octaspards | Automotive Spare-Parts Catalogue & Finder",
  description:
    "Production-grade automotive aftermarket spare-parts catalogue and cross-reference finder. Search by OE number, part number, vehicle model, and aftermarket brand.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Roboto:wght@300;400;500;700;900&display=swap"
        />
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-heading font-roboto antialiased flex flex-col">
        <I18nProvider>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
