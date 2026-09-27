"use client";

import Link from "next/link";
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

export default function MerchantDashboard() {
  const { state, currentUser } = useApp();
  if (!currentUser) return null;
  const products = state.products.filter((p) => p.merchantId === currentUser.id);
  const invoices = state.invoices.filter((i) => i.merchantId === currentUser.id);
  const pending = state.settlements.filter((s) => s.merchantId === currentUser.id && s.status === "pending").reduce((sum, s) => sum + s.amount, 0);
  const settled = state.settlements.filter((s) => s.merchantId === currentUser.id && s.status === "settled").reduce((sum, s) => sum + s.amount, 0);
  return <AppShell title="داشبورد فروشگاه">
    <Card sx={{ color: "white", background: "linear-gradient(135deg,#0050A7,#003B7B)" }}><CardContent><Typography sx={{ opacity: .7 }}>موجودی در انتظار تسویه</Typography><Typography sx={{ fontWeight: 900, fontSize: 24 }}>{money(pending)}</Typography><Typography variant="caption" sx={{ opacity: .7 }}>تسویه‌شده: {money(settled)}</Typography></CardContent></Card>
    <Grid container spacing={1.5} sx={{ mt: .5 }}><Grid size={6}><Card><CardContent><Typography color="text.secondary" variant="caption">کالاهای فعال</Typography><Typography variant="h1">{products.filter((p) => p.active).length.toLocaleString("fa-IR")}</Typography></CardContent></Card></Grid><Grid size={6}><Card><CardContent><Typography color="text.secondary" variant="caption">فاکتورهای ثبت‌شده</Typography><Typography variant="h1">{invoices.length.toLocaleString("fa-IR")}</Typography></CardContent></Card></Grid></Grid>
    <Button component={Link} href="/merchant/sale" fullWidth variant="contained" sx={{ mt: 2 }}>ثبت فروش اعتباری جدید</Button>
    <Typography variant="h2" sx={{ mt: 3, mb: 1 }}>آخرین فروش‌ها</Typography><Stack spacing={1}>{invoices.slice(0, 4).map((item) => <Card key={item.id}><CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Box><Typography sx={{ fontWeight: 800 }}>{item.customerNationalId}</Typography><Typography variant="body2" color="text.secondary">{money(item.creditAmount)}</Typography></Box><StatusPill status={item.status} /></CardContent></Card>)}</Stack>
  </AppShell>;
}
