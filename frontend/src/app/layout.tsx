import type { Metadata } from "next";
import "./globals.css";
import { DashboardProvider } from "@/lib/DashboardContext";
import Navbar from "@/components/Navbar";
import Background from "@/components/Background";
import SessionManager from "@/components/SessionManager";

export const metadata: Metadata = {
  title: "Spotify Personal Analytics",
  description: "A modern dashboard for Spotify analytics",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionManager />
        <DashboardProvider>
          <Background />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <main style={{ flex: 1, paddingTop: '80px', position: 'relative', display: 'flex' }}>
               {children}
            </main>
          </div>
        </DashboardProvider>
      </body>
    </html>
  );
}
