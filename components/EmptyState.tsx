import { Box, Typography } from "@mui/material";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";

export default function EmptyState({ title, description }: { title: string; description: string }) {
  return <Box sx={{ textAlign: "center", py: 6, px: 2, color: "text.secondary" }}><Inventory2Outlined sx={{ fontSize: 48, opacity: .35 }} /><Typography sx={{ fontWeight: 800, color: "text.primary", mt: 1 }}>{title}</Typography><Typography variant="body2" sx={{ mt: .5 }}>{description}</Typography></Box>;
}
