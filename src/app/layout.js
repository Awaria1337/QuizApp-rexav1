import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Quiz App",
  description: "Interactive quiz application",
};

export default function RootLayout({ children }) {
  const isAdminRoute = children?.props?.childPropSegments?.[0] === 'admin';

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen">
          {!isAdminRoute && <Navbar />}
          <main className={`flex-1 ${!isAdminRoute ? 'ml-64' : ''}`}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}