"use client";

import { useState } from "react";
import { Alert, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money, shortDate } from "@/lib/format";
import { groupedNumber, groupedNumberInputProps, parseGroupedNumber } from "@/lib/number-input";

export default function MerchantWalletPage() {
  const { state, currentUser, requestSettlement } = useApp();
  const [amount, setAmount] = useState(0);
  const [message, setMessage] = useState("");
  if (!currentUser) return null;
  const settlements = state.settlements.filter((s) => s.merchantId === currentUser.id);
  const pending = settlements.filter((s) => s.status === "pending").reduce((sum, s) => sum + s.amount, 0);
  return <AppShell title="کیف پذیرنده"><Card><CardContent><Typography color="text.secondary">قابل درخواست برای تسویه</Typography><Typography variant="h1" sx={{ mt: .5 }}>{money(pending)}</Typography><TextField sx={{ mt: 2 }} label="مبلغ درخواست برداشت" value={groupedNumber(amount)} onChange={(e) => setAmount(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><Button fullWidth variant="contained" sx={{ mt: 1.5 }} onClick={() => { const r = requestSettlement(amount); setMessage(r.ok ? "درخواست برداشت برای بررسی ادمین ثبت شد." : r.error); }}>درخواست برداشت</Button>{message && <Alert sx={{ mt: 1.5 }} severity={message.includes("ثبت") ? "success" : "error"}>{message}</Alert>}</CardContent></Card><Typography variant="h2" sx={{ my: 2 }}>گردش تسویه</Typography>{!settlements.length ? <Card><EmptyState title="گردشی وجود ندارد" description="فروش‌های تأییدشده در این بخش ثبت می‌شوند." /></Card> : <Stack spacing={1}>{settlements.map((s) => <Card key={s.id}><CardContent sx={{ display: "flex", justifyContent: "space-between" }}><div><Typography fontWeight={900}>{money(s.amount)}</Typography><Typography variant="caption" color="text.secondary">{shortDate(s.createdAt)}</Typography></div><StatusPill status={s.status} /></CardContent></Card>)}</Stack>}</AppShell>;
}
