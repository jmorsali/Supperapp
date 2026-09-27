"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Badge, Box, IconButton, Paper, Typography } from "@mui/material";
import HomeRounded from "@mui/icons-material/HomeRounded";
import AccountBalanceWalletRounded from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditScoreRounded from "@mui/icons-material/CreditScoreRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import PersonRounded from "@mui/icons-material/PersonRounded";
import StorefrontRounded from "@mui/icons-material/StorefrontRounded";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import PointOfSaleRounded from "@mui/icons-material/PointOfSaleRounded";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import NotificationsNoneRounded from "@mui/icons-material/NotificationsNoneRounded";
import GroupsRounded from "@mui/icons-material/GroupsRounded";
import TuneRounded from "@mui/icons-material/TuneRounded";
import Logo from "./Logo";
import { useApp } from "@/contexts/AppContext";
import { useEffect } from "react";

const menus = {
  customer: [
    { href: "/home", label: "خانه", icon: HomeRounded },
    { href: "/assets", label: "دارایی", icon: AccountBalanceWalletRounded },
    { href: "/credit", label: "اعتبار", icon: CreditScoreRounded },
    { href: "/debts", label: "بدهی‌ها", icon: ReceiptLongRounded },
    { href: "/profile", label: "پروفایل", icon: PersonRounded },
  ],
  merchant: [
    { href: "/merchant", label: "خانه", icon: StorefrontRounded },
    { href: "/merchant/products", label: "کالاها", icon: Inventory2Rounded },
    { href: "/merchant/sale", label: "فروش", icon: PointOfSaleRounded },
    { href: "/merchant/wallet", label: "تسویه", icon: AccountBalanceWalletRounded },
    { href: "/profile", label: "پروفایل", icon: PersonRounded },
  ],
  admin: [
    { href: "/admin", label: "داشبورد", icon: AdminPanelSettingsRounded },
    { href: "/admin/users", label: "کاربران", icon: GroupsRounded },
    { href: "/admin/shops", label: "فروشگاه", icon: StorefrontRounded },
    { href: "/admin/plans", label: "طرح‌ها", icon: TuneRounded },
    { href: "/profile", label: "پروفایل", icon: PersonRounded },
  ],
};

export default function AppShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { currentUser, ready, state } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (!ready) return;
    if (!currentUser) return router.replace("/login");
    const customerOnly = ["/home", "/assets", "/credit", "/debts", "/invoices", "/kyc"].some((path) => pathname === path || pathname.startsWith(`${path}/`));
    const forbidden = (pathname.startsWith("/admin") && currentUser.role !== "admin") || (pathname.startsWith("/merchant") && currentUser.role !== "merchant") || (customerOnly && currentUser.role !== "customer");
    if (forbidden) router.replace(currentUser.role === "customer" ? "/home" : currentUser.role === "merchant" ? "/merchant" : "/admin");
  }, [ready, currentUser, pathname, router]);
  if (!ready || !currentUser) return null;
  const items = menus[currentUser.role];
  const unread = state.notifications.filter((n) => n.userId === currentUser.id && !n.read).length;

  return <Box sx={{ maxWidth: 540, minHeight: "100dvh", mx: "auto", bgcolor: "background.default", position: "relative", pb: 11, borderInline: { sm: "1px solid #E5EAF1" } }}>
    <Paper square sx={{ position: "sticky", top: 0, zIndex: 10, px: 2, py: 1.25, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #E5EAF1" }}>
      <Box><Logo /><Typography sx={{ mt: .8, fontSize: 12, fontWeight: 800 }}>{title}</Typography></Box>
      <IconButton component={Link} href="/notifications" aria-label="اعلان‌ها"><Badge color="error" badgeContent={unread}><NotificationsNoneRounded color="primary" /></Badge></IconButton>
    </Paper>
    <Box component="main" sx={{ p: 2 }}>{children}</Box>
    <Paper sx={{ position: "fixed", zIndex: 20, bottom: 0, left: "50%", transform: "translateX(-50%)", width: "min(100%, 540px)", borderRadius: "18px 18px 0 0", borderTop: "1px solid #E5EAF1", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", px: .5, pb: "max(8px, env(safe-area-inset-bottom))" }}>
      {items.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || (href !== "/home" && href !== "/merchant" && href !== "/admin" && pathname.startsWith(href));
        return <Box key={href} component={Link} href={href} sx={{ textAlign: "center", py: 1, color: active ? "primary.main" : "text.secondary", position: "relative" }}>
          {active && <Box sx={{ position: "absolute", top: 0, right: "28%", left: "28%", height: 3, borderRadius: 4, bgcolor: "brandGreen.main" }} />}
          <Icon sx={{ fontSize: 23 }} /><Typography sx={{ fontSize: 10, fontWeight: active ? 800 : 600, mt: -.25 }}>{label}</Typography>
        </Box>;
      })}
    </Paper>
  </Box>;
}
