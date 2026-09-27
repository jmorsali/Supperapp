"use client";

import { Card, CardContent, Stack, Switch, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

export default function AdminShopsPage() {
  const { state, toggleUser } = useApp();
  const shops = state.users.filter((u) => u.role === "merchant");
  return <AppShell title="فروشگاه‌ها"><Stack spacing={1.25}>{shops.map((shop) => { const products = state.products.filter((p) => p.merchantId === shop.id); const sales = state.invoices.filter((i) => i.merchantId === shop.id && i.status === "approved").reduce((s, i) => s + i.creditAmount, 0); return <Card key={shop.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography fontWeight={900}>{shop.fullName}</Typography><Typography variant="body2" color="text.secondary">مدیر پذیرنده: {shop.mobile}</Typography></div><Switch checked={shop.active} onChange={() => toggleUser(shop.id)} /></Stack><Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}><Typography variant="body2">{products.length.toLocaleString("fa-IR")} کالا</Typography><Typography variant="body2" fontWeight={800}>{money(sales)} فروش اعتباری</Typography></Stack></CardContent></Card>; })}</Stack></AppShell>;
}
