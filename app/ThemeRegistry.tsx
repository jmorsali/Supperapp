"use client";

import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { prefixer } from "stylis";
import rtlPlugin from "stylis-plugin-rtl";
import { theme } from "./theme";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return <AppRouterCacheProvider options={{ key: "hummers-rtl", prepend: true, stylisPlugins: [prefixer, rtlPlugin] }}><ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider></AppRouterCacheProvider>;
}
