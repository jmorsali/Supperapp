"use client";

import { Card, CardContent, Chip, Stack, Switch, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

export default function AdminPlansPage() {
  const { state, togglePlan } = useApp();
  return <AppShell title="طرح‌های اعتباری"><Stack spacing={1.25}>{state.creditPlans.map((plan) => <Card key={plan.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography fontWeight={900}>{plan.title}</Typography><Typography variant="body2" color="text.secondary">{plan.financeProvider}</Typography></div><Switch checked={plan.isAvailableInHummersApp} onChange={() => togglePlan(plan.id)} /></Stack><Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5 }}><Chip label={`تا ${money(plan.maxAmount)}`} /><Chip label={`${plan.profitRate.toLocaleString("fa-IR")}٪`} /><Chip label={`${plan.collateralRatio.toLocaleString("fa-IR")}٪ وثیقه`} /></Stack><Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>{plan.isAvailableInHummersApp ? "در Hummers app نمایش داده می‌شود" : "فقط در بک‌آفیس موجود است"}</Typography></CardContent></Card>)}</Stack></AppShell>;
}
