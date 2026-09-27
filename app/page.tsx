"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress } from "@mui/material";
import { useApp } from "@/contexts/AppContext";

export default function IndexPage() {
  const { ready, currentUser } = useApp();
  const router = useRouter();
  useEffect(() => {
    if (!ready) return;
    router.replace(!currentUser ? "/login" : currentUser.role === "customer" ? "/home" : currentUser.role === "merchant" ? "/merchant" : "/admin");
  }, [ready, currentUser, router]);
  return <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
}
