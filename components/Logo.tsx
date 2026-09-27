import { Box, Typography } from "@mui/material";

export default function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
    <Box sx={{ width: 39, height: 39, borderRadius: 2.5, bgcolor: inverse ? "white" : "primary.main", color: inverse ? "primary.main" : "white", display: "grid", placeItems: "center", fontSize: 22, fontWeight: 900, position: "relative" }}>H<Box sx={{ position: "absolute", width: 10, height: 10, borderRadius: "50%", bgcolor: "brandGreen.main", top: -2, left: -2 }} /></Box>
    <Box><Typography sx={{ fontWeight: 900, color: inverse ? "white" : "primary.main", lineHeight: 1 }}>Hummers</Typography><Typography sx={{ fontSize: 10, color: inverse ? "rgba(255,255,255,.72)" : "text.secondary" }}>دارایی امروز، اعتبار فردا</Typography></Box>
  </Box>;
}
