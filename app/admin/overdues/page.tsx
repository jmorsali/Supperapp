"use client";

import { useState } from "react";
import { Alert, Button, Card, CardContent, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

export default function OverduesPage() {
  const { state, liquidateCollateral } = useApp();
  const [assetByContract, setAssetByContract] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const contracts = state.contracts.filter((c) => c.overdueAmount > 0);
  return <AppShell title="وصول از وثیقه">{message && <Alert sx={{ mb: 2 }}>{message}</Alert>}{!contracts.length ? <Card><EmptyState title="بدهی معوقی وجود ندارد" description="گزارش اقساط با بیش از ده روز تأخیر در این بخش نمایش داده می‌شود." /></Card> : <Stack spacing={1.5}>{contracts.map((contract) => { const user = state.users.find((u) => u.id === contract.userId); const assets = state.assets.filter((a) => a.userId === contract.userId && a.currentValue >= contract.overdueAmount + contract.penaltyAmount); return <Card key={contract.id}><CardContent><Typography fontWeight={900}>{user?.fullName} — {contract.contractNumber}</Typography><Typography color="error" sx={{ mt: 1 }}>قابل وصول: {money(contract.overdueAmount + contract.penaltyAmount)}</Typography><TextField select label="دارایی جهت برداشت" sx={{ mt: 2 }} value={assetByContract[contract.id] || ""} onChange={(e) => setAssetByContract({ ...assetByContract, [contract.id]: e.target.value })}>{assets.map((asset) => <MenuItem key={asset.id} value={asset.id}>{asset.title} — {money(asset.currentValue)}</MenuItem>)}</TextField><Button disabled={!assetByContract[contract.id]} fullWidth variant="contained" color="warning" sx={{ mt: 1.5 }} onClick={() => { const r = liquidateCollateral(contract.id, assetByContract[contract.id]); setMessage(r.ok ? "مبلغ بدهی از دارایی برداشت و برای لیزینگ ثبت شد." : r.error); }}>برداشت مبلغ بدهی و جریمه</Button></CardContent></Card>; })}</Stack>}</AppShell>;
}
