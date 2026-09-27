"use client";

import { useState } from "react";
import { Alert, Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money, shortDate } from "@/lib/format";

export default function InvoicesPage() {
  const { state, currentUser, decideInvoice } = useApp();
  const [message, setMessage] = useState("");
  if (!currentUser) return null;
  const invoices = state.invoices.filter((i) => i.customerId === currentUser.id);
  return <AppShell title="فاکتورهای من">
    {message && <Alert sx={{ mb: 2 }}>{message}</Alert>}
    {!invoices.length ? <Card><EmptyState title="فاکتوری ثبت نشده" description="فاکتورهای ارسالی فروشگاه اینجا نمایش داده می‌شوند." /></Card> : <Stack spacing={1.5}>{invoices.map((invoice) => <Card key={invoice.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography sx={{ fontWeight: 900 }}>{invoice.merchantName}</Typography><Typography variant="caption" color="text.secondary">{shortDate(invoice.createdAt)}</Typography></div><StatusPill status={invoice.status} /></Stack><Divider sx={{ my: 1.5 }} />{invoice.items.map((item) => <Stack key={item.productId} direction="row" justifyContent="space-between" sx={{ mb: .75 }}><Typography variant="body2">{item.name} × {item.quantity.toLocaleString("fa-IR")}</Typography><Typography variant="body2" sx={{ fontWeight: 700 }}>{money(item.quantity * item.unitPrice - item.discount + item.tax)}</Typography></Stack>)}<Divider sx={{ my: 1.5 }} /><Stack direction="row" justifyContent="space-between"><Typography>جمع فاکتور</Typography><Typography sx={{ fontWeight: 900 }}>{money(invoice.totalAmount)}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography color="primary">پرداخت اعتباری</Typography><Typography color="primary" sx={{ fontWeight: 900 }}>{money(invoice.creditAmount)}</Typography></Stack><Stack direction="row" justifyContent="space-between"><Typography color="text.secondary">پرداخت خارج از سامانه</Typography><Typography color="text.secondary">{money(invoice.cashAmount)}</Typography></Stack>{invoice.status === "awaiting-customer" && <Stack direction="row" spacing={1} sx={{ mt: 2 }}><Button fullWidth color="error" variant="outlined" onClick={() => { decideInvoice(invoice.id, false); setMessage("فاکتور رد شد."); }}>رد</Button><Button fullWidth variant="contained" onClick={() => { const r = decideInvoice(invoice.id, true); setMessage(r.ok ? "خرید ثبت و برای ارزیابی ارسال شد." : r.error); }}>تأیید خرید</Button></Stack>}</CardContent></Card>)}</Stack>}
  </AppShell>;
}
