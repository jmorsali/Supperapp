"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Alert, Button, Card, CardContent, CircularProgress, Stack, Typography } from "@mui/material";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";
import { money } from "@/lib/format";

type Result = { productId: string; productTitle: string; amount: number; transactionId: string };

export default function PaymentResultPage() {
  const { buyAsset } = useApp();
  const handled = useRef(false);
  const [result, setResult] = useState<Result | null>(null);
  useEffect(() => {
    if (handled.current) return;
    const raw = sessionStorage.getItem("hummers-payment-result");
    if (!raw) return;
    handled.current = true;
    const data: Result = JSON.parse(raw);
    buyAsset(data.productId, data.amount);
    sessionStorage.removeItem("hummers-payment-result");
    sessionStorage.removeItem("hummers-pending-payment");
    setResult(data);
  }, [buyAsset]);
  return <AppShell title="نتیجه پرداخت">{!result ? <Card><CardContent sx={{ textAlign: "center" }}><CircularProgress /><Typography sx={{ mt: 2 }}>در حال بررسی نتیجه پرداخت…</Typography></CardContent></Card> : <Card><CardContent sx={{ textAlign: "center", py: 4 }}><CheckCircleRounded color="success" sx={{ fontSize: 72 }} /><Typography variant="h2" sx={{ mt: 1 }}>پرداخت با موفقیت انجام شد</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>{result.productTitle}</Typography><Typography fontWeight={900} fontSize={20} sx={{ mt: 1 }}>{money(result.amount)}</Typography><Alert severity="info" sx={{ my: 2, textAlign: "right" }}>درخواست صدور ثبت شد و نتیجه نهایی پس از استعلام از سبدگردان یا بیمه طی ۱ تا ۲ روز مشخص می‌شود.</Alert><Stack spacing={1}><Button component={Link} href="/assets" variant="contained">مشاهده وضعیت دارایی</Button><Button component={Link} href="/home" variant="text">بازگشت به خانه</Button></Stack></CardContent></Card>}</AppShell>;
}
