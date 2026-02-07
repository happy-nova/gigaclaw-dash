import type { Metadata } from "next";
import { Orbitron, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Agent Onboard | Create Your AI Assistant",
  description: "Self-service portal to create your personal AI assistant on the team's shared OpenClaw instance.",
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
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="antialiased min-h-screen bg-grid">
        {/* Ambient glow */}
        <div className="fixed inset-0 bg-giga-glow pointer-events-none" />
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
