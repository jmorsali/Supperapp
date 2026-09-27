"use client";

import { useMemo, useState } from "react";
import { Alert, Button, Card, CardContent, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";
import { InvoiceItem } from "@/lib/types";
import { groupedNumber, groupedNumberInputProps, parseGroupedNumber } from "@/lib/number-input";

export default function SalePage() {
  const { state, currentUser, createInvoice } = useApp();
  const [nationalId, setNationalId] = useState("0012345678");
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selected, setSelected] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [creditAmount, setCreditAmount] = useState(0);
  const [message, setMessage] = useState("");
  const products = state.products.filter((p) => p.merchantId === currentUser?.id && p.active && p.stock > 0);
  const total = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.unitPrice - i.discount + i.tax, 0), [items]);
  if (!currentUser) return null;
  const add = () => { const p = products.find((x) => x.id === selected); if (!p) return; setItems([...items, { productId: p.id, name: p.name, quantity, unitPrice: p.price, discount, tax }]); setSelected(""); setDiscount(0); setTax(0); };
  const submit = () => { const r = createInvoice(nationalId, items, creditAmount); setMessage(r.ok ? "فاکتور برای تأیید مشتری ارسال شد." : r.error); if (r.ok) setItems([]); };
  return <AppShell title="فروش اعتباری">{message && <Alert severity={message.includes("ارسال") ? "success" : "error"} sx={{ mb: 2 }}>{message}</Alert>}<Card><CardContent><Stack spacing={1.5}><TextField label="کد ملی خریدار" value={nationalId} onChange={(e) => setNationalId(e.target.value)} /><TextField select label="انتخاب کالا" value={selected} onChange={(e) => setSelected(e.target.value)}>{products.map((p) => <MenuItem value={p.id} key={p.id}>{p.name} — {money(p.price)}</MenuItem>)}</TextField><Stack direction="row" spacing={1}><TextField label="تعداد" value={groupedNumber(quantity)} onChange={(e) => setQuantity(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><TextField label="تخفیف" value={groupedNumber(discount)} onChange={(e) => setDiscount(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><TextField label="مالیات" value={groupedNumber(tax)} onChange={(e) => setTax(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /></Stack><Button variant="outlined" disabled={!selected || quantity < 1} onClick={add}>افزودن به فاکتور</Button></Stack></CardContent></Card>
    {items.length > 0 && <Card sx={{ mt: 2 }}><CardContent><Typography variant="h2">پیش‌فاکتور</Typography>{items.map((item, index) => <Stack key={`${item.productId}-${index}`} direction="row" justifyContent="space-between" sx={{ mt: 1.2 }}><Typography variant="body2">{item.name} × {item.quantity.toLocaleString("fa-IR")}</Typography><Typography variant="body2" fontWeight={800}>{money(item.quantity * item.unitPrice - item.discount + item.tax)}</Typography></Stack>)}<Divider sx={{ my: 1.5 }} /><Stack direction="row" justifyContent="space-between"><Typography>مبلغ کل</Typography><Typography fontWeight={900}>{money(total)}</Typography></Stack><TextField sx={{ mt: 2 }} label="مبلغ پرداخت اعتباری" value={groupedNumber(creditAmount)} onChange={(e) => setCreditAmount(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>بخش خارج از سامانه: {money(Math.max(0, total - creditAmount))}</Typography><Button fullWidth variant="contained" sx={{ mt: 2 }} onClick={submit}>ارسال برای تأیید مشتری</Button></CardContent></Card>}
  </AppShell>;
}
