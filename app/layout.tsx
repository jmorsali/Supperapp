import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ThemeRegistry from "./ThemeRegistry";
import { AppProvider } from "@/contexts/AppContext";
import PwaRegister from "@/components/PwaRegister";

const dana = localFont({
  src: [
    { path: "../public/fonts/Dana-FaNum-Thin.ttf", weight: "100", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-ExtraLight.ttf", weight: "200", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-DemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-Black.ttf", weight: "900", style: "normal" },
    { path: "../public/fonts/Dana-FaNum-UltraBold.ttf", weight: "950", style: "normal" },
  ],
  variable: "--font-dana",
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "Hummers app",
  description: "مدیریت دارایی و اعتبار هامرز",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Hummers" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 1, themeColor: "#0050A7" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl"><body className={dana.variable} style={{ fontFamily: "var(--font-dana)" }}><ThemeRegistry><AppProvider><PwaRegister />{children}</AppProvider></ThemeRegistry></body></html>;
}
