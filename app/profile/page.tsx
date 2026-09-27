"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";

export default function ProfilePage() {
  const { currentUser, logout } = useApp();
  const router = useRouter();
  if (!currentUser) return null;
  return <AppShell title="پروفایل"><Card><CardContent sx={{ textAlign: "center" }}><Avatar sx={{ width: 72, height: 72, mx: "auto", bgcolor: "primary.main", fontSize: 30 }}>{currentUser.fullName[0]}</Avatar><Typography variant="h2" sx={{ mt: 1.5 }}>{currentUser.fullName}</Typography><Typography color="text.secondary">{currentUser.mobile}</Typography><Divider sx={{ my: 2 }} /><Stack spacing={1} textAlign="right"><Typography variant="body2">نقش: {currentUser.role === "customer" ? "مشتری" : currentUser.role === "merchant" ? "فروشگاه" : "مدیر سامانه"}</Typography><Typography variant="body2">کد ملی: {currentUser.nationalId || "ثبت نشده"}</Typography><Typography variant="body2">سطح احراز هویت: {currentUser.kycLevel.toLocaleString("fa-IR")}</Typography></Stack>{currentUser.role === "customer" && <Button component={Link} href="/kyc" fullWidth variant="outlined" sx={{ mt: 2 }}>مدیریت احراز هویت</Button>}<Button fullWidth color="error" variant="outlined" sx={{ mt: 1 }} onClick={() => { logout(); router.replace("/login"); }}>خروج از حساب</Button></CardContent></Card></AppShell>;
}
