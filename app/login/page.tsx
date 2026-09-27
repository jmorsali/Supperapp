"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import PhoneIphoneRounded from "@mui/icons-material/PhoneIphoneRounded";
import Logo from "@/components/Logo";
import { useApp } from "@/contexts/AppContext";
import { demoMobiles } from "@/lib/mock-data";

export default function LoginPage() {
  const { requestOtp, verifyOtp, otpMobile, state } = useApp();
  const router = useRouter();
  const [mobile, setMobile] = useState(demoMobiles.customer);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const submitMobile = () => { const result = requestOtp(mobile); if (!result.ok) setError(result.error); else setError(""); };
  const submitOtp = () => {
    const result = verifyOtp(code);
    if (!result.ok) return setError(result.error);
    const user = state.users.find((u) => u.mobile === otpMobile);
    router.replace(user?.role === "merchant" ? "/merchant" : user?.role === "admin" ? "/admin" : "/home");
  };
  return <Box sx={{ minHeight: "100dvh", maxWidth: 540, mx: "auto", bgcolor: "#F4F7FB", display: "flex", flexDirection: "column" }}>
    <Box sx={{ minHeight: 245, p: 3, color: "white", background: "radial-gradient(circle at 10% 10%, #1D70C9, #003B7B 70%)", borderRadius: "0 0 34px 34px", position: "relative", overflow: "hidden" }}>
      <Logo inverse />
      <Box sx={{ position: "absolute", width: 190, height: 190, borderRadius: "50%", border: "32px solid rgba(255,255,255,.07)", left: -45, bottom: -80 }} />
      <Typography variant="h1" sx={{ mt: 6 }}>همه‌چیز برای خریدی مطمئن</Typography>
      <Typography sx={{ mt: 1, opacity: .78, fontSize: 13 }}>دارایی بسازید، اعتبار بگیرید و هوشمندانه خرید کنید.</Typography>
    </Box>
    <Box sx={{ px: 2, mt: -2.5, zIndex: 1 }}><Card><CardContent sx={{ p: 2.5 }}>
      <Typography variant="h2">ورود به Hummers app</Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mt: .75, mb: 2.5 }}>{otpMobile ? `کد ارسال‌شده به ${otpMobile} را وارد کنید.` : "شماره موبایل خود را وارد کنید."}</Typography>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        {!otpMobile ? <><TextField label="شماره موبایل" inputMode="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} InputProps={{ startAdornment: <PhoneIphoneRounded color="action" sx={{ ml: 1 }} /> }} /><Button variant="contained" onClick={submitMobile}>دریافت کد تأیید</Button></> : <><TextField autoFocus label="کد پنج‌رقمی" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} helperText="کد دمو: ۱۲۳۴۵" /><Button variant="contained" onClick={submitOtp}>ورود</Button><Button onClick={() => location.reload()}>اصلاح شماره موبایل</Button></>}
      </Stack>
    </CardContent></Card></Box>
    <Box sx={{ p: 2 }}><Typography variant="caption" color="text.secondary">حساب‌های دمو</Typography><Stack spacing={.5} sx={{ mt: 1 }}>
      <Button size="small" variant="text" onClick={() => setMobile(demoMobiles.customer)}>مشتری: {demoMobiles.customer}</Button>
      <Button size="small" color="warning" variant="text" onClick={() => setMobile("09121112233")}>مشتری فاقد سجام: 09121112233</Button>
      <Button size="small" variant="text" onClick={() => setMobile(demoMobiles.merchant)}>فروشگاه: {demoMobiles.merchant}</Button>
      <Button size="small" variant="text" onClick={() => setMobile(demoMobiles.admin)}>ادمین: {demoMobiles.admin}</Button>
    </Stack></Box>
  </Box>;
}
