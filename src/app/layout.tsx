import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Network Intercept - CSP Auditor",
  description: "Network Intercept - CSP Auditor is a powerful tool designed to monitor and analyze Content Security Policies (CSP) on websites and web applications. It intercepts network traffic, audits CSP headers in real-time, and detects vulnerabilities or misconfigurations, ensuring robust security and compliance. Ideal for security professionals and web developers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
