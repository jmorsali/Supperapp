"use client";

import Link from "next/link";
import { Alert, Box, Button, Card, CardContent, Divider, LinearProgress, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money, shortDate } from "@/lib/format";

export default function AssetsPage() {
  const { state, currentUser, redeemAsset } = useApp();
  const [message, setMessage] = React.useState("");
  if (!currentUser) return null;
  const assets = state.assets.filter((a) => a.userId === currentUser.id);
  return <AppShell title="کیف دارایی">
    <Button component={Link} href="/assets/buy" fullWidth variant="contained" sx={{ mb: 2 }}>خرید دارایی جدید</Button>
    {message && <Alert sx={{ mb: 2 }} severity="info">{message}</Alert>}
    {!assets.length ? <Card><EmptyState title="دارایی ندارید" description="با خرید اولین دارایی، کیف شما فعال می‌شود." /></Card> : <Stack spacing={1.5}>{assets.map((asset) => {
      const free = asset.currentValue - asset.blockedAmount;
      return <Card key={asset.id}><CardContent><Stack direction="row" justifyContent="space-between" alignItems="start"><Box><Typography sx={{ fontWeight: 900 }}>{asset.title}</Typography><Typography variant="caption" color="text.secondary">خرید در {shortDate(asset.createdAt)}</Typography></Box><StatusPill status={asset.status} /></Stack><Divider sx={{ my: 1.5 }} /><Stack direction="row" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">ارزش روز</Typography><Typography sx={{ fontWeight: 800 }}>{money(asset.currentValue)}</Typography></Box><Box><Typography variant="caption" color="text.secondary">قابل برداشت</Typography><Typography sx={{ fontWeight: 800, color: "success.main" }}>{money(free)}</Typography></Box></Stack>{asset.blockedAmount > 0 && <Box sx={{ mt: 1.5 }}><Stack direction="row" justifyContent="space-between"><Typography variant="caption">وثیقه اعتبار</Typography><Typography variant="caption">{money(asset.blockedAmount)}</Typography></Stack><LinearProgress variant="determinate" value={(asset.blockedAmount / asset.currentValue) * 100} color="warning" sx={{ mt: .5, height: 7, borderRadius: 9 }} /></Box>}<Button disabled={asset.status !== "active" || free <= 0} onClick={() => { const r = redeemAsset(asset.id, Math.min(10_000_000, free)); setMessage(r.ok ? "درخواست ابطال ۱۰ میلیون تومان ثبت شد." : r.error); }} fullWidth variant="outlined" sx={{ mt: 2 }}>ابطال ۱۰ میلیون تومان</Button></CardContent></Card>;
    })}</Stack>}
  </AppShell>;
}

import React from "react";
