"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Stack, TextField, Typography } from "@mui/material";
import CreditCardRounded from "@mui/icons-material/CreditCardRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { groupedNumber } from "@/lib/number-input";

type Pending = { productId: string; productTitle: string; amount: number };

export default function SamanPaymentPage() {
  const router = useRouter();
  const [pending, setPending] = useState<Pending | null>(null);
  const [card, setCard] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => { const raw = sessionStorage.getItem("hummers-pending-payment"); setPending(raw ? JSON.parse(raw) : null); }, []);
  const pay = async () => {
    if (card.replace(/\D/g, "").length !== 16) return setError("شماره کارت شانزده‌رقمی را وارد کنید.");
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/mock/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount: pending?.amount, scenario: "success" }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "پرداخت ناموفق بود.");
      sessionStorage.setItem("hummers-payment-result", JSON.stringify({ ...result, ...pending }));
      router.replace("/payment/result?status=success");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "خطا در ارتباط با درگاه"); setLoading(false); }
  };
  if (!pending) return <Box sx={{ minHeight: "100dvh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  return <Box dir="rtl" sx={{ minHeight: "100dvh", bgcolor: "#f7f7fb", pb: 3 }}>
    <Box sx={{ height: 46, bgcolor: "#0785d1" }} />
    <Box sx={{ maxWidth: 480, mx: "auto", px: 2, mt: -1 }}>
      <Card sx={{ borderRadius: 2, mb: 1.5 }}><CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><Box sx={{ color: "#0785d1", fontWeight: 950, fontSize: 24, direction: "ltr" }}>SEP ◼</Box><Typography fontWeight={800}>درگاه پرداخت اینترنتی سپ</Typography><Typography sx={{ color: "#0096c7", fontWeight: 900 }}>شتاب</Typography></CardContent></Card>
      <Card sx={{ borderRadius: 2, mb: 1.5 }}><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography variant="caption" color="text.secondary">پذیرنده</Typography><Typography fontWeight={800}>Hummers app</Typography></Box><Box textAlign="left"><Typography variant="caption" color="text.secondary">مبلغ</Typography><Typography fontWeight={950}>{groupedNumber(pending.amount * 10)} ریال</Typography><Typography variant="caption">{groupedNumber(pending.amount)} تومان</Typography></Box></Stack></CardContent></Card>
      <Card sx={{ borderRadius: 2 }}><CardContent><Box sx={{ bgcolor: "#eaf6fd", color: "#0577bb", borderRadius: 1.5, p: 1.25, fontWeight: 800, mb: 2 }}>اطلاعات کارت خود را وارد کنید</Box><Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField label="شماره کارت" placeholder="----  ----  ----  ----" value={card} onChange={(e) => { const digits = e.target.value.replace(/\D/g, "").slice(0, 16); setCard(digits.replace(/(.{4})/g, "$1 ").trim()); }} inputProps={{ inputMode: "numeric", dir: "ltr" }} InputProps={{ startAdornment: <CreditCardRounded color="primary" sx={{ ml: 1 }} /> }} />
        <TextField label="شماره شناسایی دوم (CVV2)" placeholder="CVV2" inputProps={{ inputMode: "numeric", dir: "ltr" }} />
        <Stack direction="row" spacing={1}><TextField label="ماه انقضا" inputProps={{ inputMode: "numeric" }} /><TextField label="سال انقضا" inputProps={{ inputMode: "numeric" }} /></Stack>
        <Stack direction="row" spacing={1} alignItems="center"><Box sx={{ minWidth: 105, p: 1.2, textAlign: "center", bgcolor: "#fff7ed", color: "#e88822", fontSize: 25, fontWeight: 900, letterSpacing: 3 }}>۷۲۲۶۸</Box><TextField label="کد امنیتی" inputProps={{ inputMode: "numeric" }} InputProps={{ startAdornment: <RefreshRounded color="primary" sx={{ ml: 1 }} /> }} /></Stack>
        <Stack direction="row" spacing={1}><Button variant="outlined" sx={{ minWidth: 125 }}>درخواست رمز پویا</Button><TextField label="رمز دوم" inputProps={{ inputMode: "numeric" }} /></Stack>
        <FormControlLabel control={<Checkbox defaultChecked />} label="شماره کارت در درگاه‌های سپ ذخیره شود" />
        <Button variant="contained" disabled={loading} onClick={pay}>{loading ? <CircularProgress size={22} color="inherit" /> : `پرداخت ${groupedNumber(pending.amount * 10)} ریال`}</Button>
        <Button color="error" variant="text" onClick={() => router.replace("/assets/buy")}>انصراف و بازگشت به Hummers</Button>
      </Stack></CardContent></Card>
      <Typography textAlign="center" color="text.secondary" variant="caption" sx={{ display: "block", mt: 2 }}>این صفحه شبیه‌سازی درگاه سامان برای نمایش جریان MVP است و تراکنش بانکی واقعی انجام نمی‌دهد.</Typography>
    </Box>
  </Box>;
}
