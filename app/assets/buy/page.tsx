"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";
import { groupedNumber, groupedNumberInputProps, parseGroupedNumber } from "@/lib/number-input";

export default function BuyAssetPage() {
  const { state, currentUser } = useApp();
  const router = useRouter();
  const [selected, setSelected] = useState(state.assetProducts[0]?.id || "");
  const [amount, setAmount] = useState(10_000_000);
  if (!currentUser) return null;
  const product = state.assetProducts.find((p) => p.id === selected);
  const disabled = currentUser.kycLevel < 1 || !product || amount < product.minPurchase;
  return <AppShell title="خرید دارایی">
    {currentUser.kycLevel < 1 && <Alert severity="warning" sx={{ mb: 2 }}>برای خرید دارایی، احراز هویت سطح یک لازم است.</Alert>}
    <Stack spacing={1.5}>{state.assetProducts.map((item) => <Card key={item.id} onClick={() => setSelected(item.id)} sx={{ borderColor: selected === item.id ? "primary.main" : undefined, cursor: "pointer" }}><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography sx={{ fontWeight: 900 }}>{item.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{item.description}</Typography></Box><Chip label={item.kind === "fund" ? "صندوق" : "بیمه"} color={selected === item.id ? "primary" : "default"} /></Stack><Typography sx={{ color: item.mockDailyChange >= 0 ? "success.main" : "error.main", fontWeight: 800, mt: 1 }}>تغییر روزانه فرضی: {item.mockDailyChange.toLocaleString("fa-IR")}٪</Typography></CardContent></Card>)}</Stack>
    <Card sx={{ mt: 2 }}><CardContent><TextField label="مبلغ خرید به تومان" value={groupedNumber(amount)} onChange={(e) => setAmount(parseGroupedNumber(e.target.value))} inputProps={groupedNumberInputProps} /><Typography variant="caption" color="text.secondary">حداقل خرید: {money(product?.minPurchase || 0)}</Typography><Alert severity="info" sx={{ my: 2 }}>پس از پرداخت در درگاه شبیه‌سازی‌شده سامان، به Hummers app بازمی‌گردید. صدور دارایی ممکن است ۱ تا ۲ روز زمان ببرد.</Alert><Button disabled={disabled} fullWidth variant="contained" onClick={() => { sessionStorage.setItem("hummers-pending-payment", JSON.stringify({ productId: selected, productTitle: product?.title, amount })); router.push("/payment/saman"); }}>ورود به درگاه سامان</Button></CardContent></Card>
  </AppShell>;
}
