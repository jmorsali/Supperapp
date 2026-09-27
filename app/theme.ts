"use client";

import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette { brandGreen: Palette["primary"]; }
  interface PaletteOptions { brandGreen?: PaletteOptions["primary"]; }
}

export const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: { main: "#0050A7", dark: "#003B7B", light: "#EAF3FD" },
    brandGreen: { main: "#60C548", dark: "#3A9B25", light: "#ECF9E9" },
    background: { default: "#F4F7FB", paper: "#FFFFFF" },
    text: { primary: "#172033", secondary: "#697386" },
    success: { main: "#079455" },
    warning: { main: "#E89113" },
    error: { main: "#D92D20" },
  },
  typography: {
    fontFamily: "var(--font-dana), system-ui, arial",
    h1: { fontSize: "1.5rem", fontWeight: 800 },
    h2: { fontSize: "1.18rem", fontWeight: 800 },
    h3: { fontSize: "1rem", fontWeight: 750 },
    button: { fontWeight: 700, textTransform: "none" },
  },
  shape: { borderRadius: 16 },
  components: {
    MuiButton: { styleOverrides: { root: { minHeight: 46, borderRadius: 14, boxShadow: "none" } } },
    MuiCard: { styleOverrides: { root: { border: "1px solid #E5EAF1", boxShadow: "0 8px 30px rgba(0, 45, 95, .06)" } } },
    MuiPaper: { defaultProps: { elevation: 0 } },
    MuiTextField: { defaultProps: { fullWidth: true, size: "small" } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 12, background: "#fff" } } },
    MuiChip: { styleOverrides: { root: { borderRadius: 10, fontWeight: 700 } } },
  },
});
