import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Icon Generator",
  description: "Vector-first icon generator"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className="mx-auto min-h-screen max-w-7xl p-6">{children}</main>
      </body>
    </html>
  );
}
