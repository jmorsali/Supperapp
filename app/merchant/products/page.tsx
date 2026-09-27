"use client";

import { useState } from "react";
import { Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";
import { groupedNumber, groupedNumberInputProps, parseGroupedNumber } from "@/lib/number-input";

export default function ProductsPage() {
  const { state, currentUser, addProduct, updateProduct } = useApp();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", category: "", price: 0, stock: 0, description: "", active: true });
  if (!currentUser) return null;
  const products = state.products.filter((p) => p.merchantId === currentUser.id);
  return <AppShell title="مدیریت کالاها"><Button fullWidth variant="contained" onClick={() => setOpen(true)} sx={{ mb: 2 }}>افزودن کالا</Button>{!products.length ? <Card><EmptyState title="کالایی ندارید" description="اولین کالای فروشگاه را اضافه کنید." /></Card> : <Stack spacing={1.25}>{products.map((p) => <Card key={p.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography sx={{ fontWeight: 900 }}>{p.name}</Typography><Typography variant="caption" color="text.secondary">{p.sku} • {p.category}</Typography></div><Switch checked={p.active} onChange={() => updateProduct(p.id, { active: !p.active })} /></Stack><Stack direction="row" justifyContent="space-between" sx={{ mt: 1.5 }}><Typography sx={{ fontWeight: 800 }}>{money(p.price)}</Typography><TextField sx={{ width: 130 }} label="موجودی" value={groupedNumber(p.stock)} onChange={(e) => updateProduct(p.id, { stock: parseGroupedNumber(e.target.value) })} inputProps={groupedNumberInputProps} /></Stack></CardContent></Card>)}</Stack>}
    <Dialog fullWidth open={open} onClose={() => setOpen(false)}><DialogTitle>کالای جدید</DialogTitle><DialogContent><Stack spacing={1.5} sx={{ pt: 1 }}>{(["name", "sku", "category", "price", "stock", "description"] as const).map((key) => { const numeric = key === "price" || key === "stock"; return <TextField key={key} multiline={key === "description"} label={{ name: "نام کالا", sku: "کد کالا", category: "دسته‌بندی", price: "قیمت تومان", stock: "موجودی", description: "توضیحات" }[key]} value={numeric ? groupedNumber(form[key]) : form[key]} onChange={(e) => setForm({ ...form, [key]: numeric ? parseGroupedNumber(e.target.value) : e.target.value })} inputProps={numeric ? groupedNumberInputProps : undefined} />; })}<FormControlLabel control={<Switch checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />} label="نمایش کالا" /></Stack></DialogContent><DialogActions><Button onClick={() => setOpen(false)}>انصراف</Button><Button variant="contained" onClick={() => { if (!form.name || !form.sku) return; addProduct(form); setOpen(false); }}>ثبت</Button></DialogActions></Dialog>
  </AppShell>;
}
