import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Welmio",
  description: "Personal Finance App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
