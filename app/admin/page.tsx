"use client";

import Link from "next/link";
import { Alert, Button, Card, CardContent, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

export default function AdminDashboard() {
  const { state, currentUser, advanceEvaluation, setAssetStatus, completeSettlement, resetDemo } = useApp();
  if (!currentUser) return null;
  const evaluating = state.creditRequests.filter((r) => r.status === "evaluating");
  const pendingAssets = state.assets.filter((a) => a.status === "pending");
  const pendingSettlements = state.settlements.filter((s) => s.status === "pending");
  return <AppShell title="مدیریت Hummers app">
    <Grid container spacing={1.2}>{[
      ["کاربران", state.users.length], ["فروشگاه‌ها", state.users.filter((u) => u.role === "merchant").length], ["پرونده‌های ارزیابی", evaluating.length], ["اقساط معوق", state.contracts.filter((c) => c.overdueAmount > 0).length],
    ].map(([label, value]) => <Grid size={6} key={String(label)}><Card><CardContent><Typography variant="caption" color="text.secondary">{label}</Typography><Typography variant="h1">{Number(value).toLocaleString("fa-IR")}</Typography></CardContent></Card></Grid>)}</Grid>
    <Button component={Link} href="/admin/overdues" variant="outlined" fullWidth sx={{ mt: 2 }}>گزارش اقساط معوق و برداشت وثیقه</Button>
    <Typography variant="h2" sx={{ mt: 3, mb: 1 }}>کنترل سناریوهای ماک</Typography><Alert severity="info" sx={{ mb: 1.5 }}>این کنترل‌ها فقط برای شبیه‌سازی گذر زمان در نسخه MVP هستند.</Alert>
    <Stack spacing={1.25}>{pendingAssets.map((asset) => <Card key={asset.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography fontWeight={900}>صدور {asset.title}</Typography><Typography variant="body2" color="text.secondary">{money(asset.purchaseAmount)}</Typography></div><StatusPill status={asset.status} /></Stack><Stack direction="row" spacing={1} sx={{ mt: 1.5 }}><Button fullWidth color="error" variant="outlined" onClick={() => setAssetStatus(asset.id, "failed")}>ناموفق</Button><Button fullWidth variant="contained" onClick={() => setAssetStatus(asset.id, "active")}>صدور موفق</Button></Stack></CardContent></Card>)}
    {evaluating.map((request) => <Card key={request.id}><CardContent><Typography fontWeight={900}>ارزیابی {request.planTitle}</Typography><Typography variant="body2" color="text.secondary">{money(request.requestedAmount)}</Typography><LinearProgress variant="determinate" value={request.evaluationStep / 3 * 100} sx={{ my: 1.5 }} /><Button fullWidth variant="contained" onClick={() => advanceEvaluation(request.id)}>تأیید ارزیاب {(request.evaluationStep + 1).toLocaleString("fa-IR")}</Button></CardContent></Card>)}
    {pendingSettlements.map((settlement) => <Card key={settlement.id}><CardContent><Typography fontWeight={900}>تسویه پذیرنده</Typography><Typography>{money(settlement.amount)}</Typography><Button fullWidth variant="contained" sx={{ mt: 1.5 }} onClick={() => completeSettlement(settlement.id)}>ثبت تسویه</Button></CardContent></Card>)}
    {!pendingAssets.length && !evaluating.length && !pendingSettlements.length && <Alert severity="success">سناریوی در انتظار اقدامی وجود ندارد.</Alert>}</Stack>
    <Button color="error" variant="text" fullWidth sx={{ mt: 3 }} onClick={resetDemo}>بازنشانی همه داده‌های دمو</Button>
  </AppShell>;
}
