"use client";

import { useState } from "react";
import { Alert, Button, Card, CardContent, LinearProgress, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/contexts/AppContext";
import { money, shortDate } from "@/lib/format";

export default function DebtsPage() {
  const { state, currentUser, payInstallment } = useApp();
  const [paid, setPaid] = useState("");
  if (!currentUser) return null;
  const contracts = state.contracts.filter((c) => c.userId === currentUser.id);
  return <AppShell title="مدیریت بدهی‌ها">
    {paid && <Alert severity="success" sx={{ mb: 2 }}>{paid}</Alert>}
    {!contracts.length ? <Card><EmptyState title="قراردادی ندارید" description="قراردادهای تسهیلاتی و اقساط آن‌ها اینجا نمایش داده می‌شوند." /></Card> : <Stack spacing={1.5}>{contracts.map((contract) => <Card key={contract.id}><CardContent><Typography sx={{ fontWeight: 900 }}>قرارداد {contract.contractNumber}</Typography><Typography variant="body2" color="text.secondary">اصل تسهیلات: {money(contract.principal)}</Typography><Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}><Typography variant="body2">پرداخت‌شده {contract.paidInstallments.toLocaleString("fa-IR")} از {contract.months.toLocaleString("fa-IR")}</Typography><Typography variant="body2">{Math.round(contract.paidInstallments / contract.months * 100).toLocaleString("fa-IR")}٪</Typography></Stack><LinearProgress variant="determinate" value={contract.paidInstallments / contract.months * 100} sx={{ mt: .75, height: 7, borderRadius: 9 }} />{contract.overdueAmount > 0 ? <Alert severity="error" sx={{ mt: 2 }}>بدهی معوق {money(contract.overdueAmount)} و جریمه {money(contract.penaltyAmount)}</Alert> : <Alert severity="info" sx={{ mt: 2 }}>قسط بعدی {money(contract.installmentAmount)} در {shortDate(contract.nextDueDate)}</Alert>}<Button disabled={contract.paidInstallments >= contract.months} fullWidth variant="contained" sx={{ mt: 2 }} onClick={() => { payInstallment(contract.id); setPaid("پرداخت ماک قسط با موفقیت ثبت شد."); }}>پرداخت قسط</Button></CardContent></Card>)}</Stack>}
  </AppShell>;
}
