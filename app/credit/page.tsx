"use client";

import { useState } from "react";
import { Alert, Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";
import { CreditPlan } from "@/lib/types";
import { groupedNumber, groupedNumberInputProps, parseGroupedNumber } from "@/lib/number-input";

export default function CreditPage() {
  const { state, currentUser, requestCredit, cancelCredit } = useApp();
  const [plan, setPlan] = useState<CreditPlan | null>(null);
  const [amount, setAmount] = useState(50_000_000);
  const [duration, setDuration] = useState(12);
  const [message, setMessage] = useState("");
  if (!currentUser) return null;
  const active = state.creditRequests.find((r) => r.userId === currentUser.id && ["available", "evaluating", "contract"].includes(r.status));
  const assetValue = state.assets.filter((a) => a.userId === currentUser.id && a.status === "active").reduce((s, a) => s + a.currentValue - a.blockedAmount, 0);
  const creditCapacity = Math.floor(assetValue * .7);
  const plans = state.creditPlans.filter((p) => p.active && p.isAvailableInHummersApp);
  return <AppShell title="اعتبار">
    {message && <Alert sx={{ mb: 2 }} severity={message.includes("شد") ? "success" : "error"}>{message}</Alert>}
    <Card sx={{ mb: 2, bgcolor: "primary.main", color: "white" }}><CardContent><Typography sx={{ opacity: .7, fontSize: 12 }}>حداکثر اعتبار براساس دارایی آزاد</Typography><Typography sx={{ fontSize: 23, fontWeight: 900 }}>{money(creditCapacity)}</Typography></CardContent></Card>
    {active && <Card sx={{ mb: 2 }}><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography sx={{ fontWeight: 900 }}>{active.planTitle}</Typography><Typography variant="h2" sx={{ mt: 1 }}>{money(active.requestedAmount)}</Typography></Box><StatusPill status={active.status} /></Stack>{active.status === "available" && <Button color="error" variant="outlined" fullWidth sx={{ mt: 2 }} onClick={() => cancelCredit(active.id)}>انصراف و آزادسازی وثیقه</Button>}</CardContent></Card>}
    <Typography variant="h2" sx={{ mb: 1.25 }}>طرح‌های قابل ارائه</Typography><Stack spacing={1.5}>{plans.map((item) => <Card key={item.id}><CardContent><Typography sx={{ fontWeight: 900 }}>{item.title}</Typography><Typography variant="body2" color="text.secondary">تأمین‌کننده: {item.financeProvider}</Typography><Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}><Box><Typography variant="caption">سقف اعتبار</Typography><Typography sx={{ fontWeight: 800 }}>{money(item.maxAmount)}</Typography></Box><Box><Typography variant="caption">نرخ سالانه</Typography><Typography sx={{ fontWeight: 800 }}>{item.profitRate.toLocaleString("fa-IR")}٪</Typography></Box></Stack><Typography variant="caption" color="text.secondary">دوره‌ها: {item.months.map((m) => m.toLocaleString("fa-IR")).join("، ")} ماه</Typography><Button fullWidth variant="contained" disabled={!!active || currentUser.kycLevel < 1} sx={{ mt: 2 }} onClick={() => { setPlan(item); setAmount(Math.min(item.maxAmount, Math.max(item.minAmount, creditCapacity))); setDuration(item.months[0]); }}>انتخاب طرح</Button></CardContent></Card>)}</Stack>
    <Dialog fullWidth open={!!plan} onClose={() => setPlan(null)}><DialogTitle>درخواست {plan?.title}</DialogTitle><DialogContent><Stack spacing={2} sx={{ pt: 1 }}><TextField label="مبلغ اعتبار به تومان" value={groupedNumber(amount)} onChange={(e) => setAmount(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><TextField select label="مدت بازپرداخت" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>{plan?.months.map((m) => <MenuItem key={m} value={m}>{m.toLocaleString("fa-IR")} ماه</MenuItem>)}</TextField><Alert severity="info">وثیقه موردنیاز: {money(Math.ceil(amount / .7))}</Alert></Stack></DialogContent><DialogActions><Button onClick={() => setPlan(null)}>انصراف</Button><Button variant="contained" onClick={() => { if (!plan) return; const result = requestCredit(plan.id, amount, duration); setMessage(result.ok ? "اعتبار با موفقیت فعال شد." : result.error); setPlan(null); }}>ثبت درخواست</Button></DialogActions></Dialog>
  </AppShell>;
}
