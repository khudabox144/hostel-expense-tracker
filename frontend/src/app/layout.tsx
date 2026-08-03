import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { ToastProvider } from "@/components/ui/Toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hostel Expense Tracker",
  description: "Track and split monthly hostel expenses among members",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-stone-50 font-sans antialiased">
        <ToastProvider>
          <div className="flex min-h-screen">
            <Sidebar />
            <main className="flex-1 min-w-0 px-4 py-6 sm:px-8 sm:py-8 pb-24 sm:pb-8">
              <div className="mx-auto max-w-6xl">{children}</div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
