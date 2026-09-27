"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Button, Card, CardContent, Checkbox, CircularProgress, FormControlLabel, Stack, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import LiveCameraCapture from "@/components/LiveCameraCapture";
import { useApp } from "@/contexts/AppContext";

export default function KycPage() {
  const { currentUser, updateKyc } = useApp();
  const router = useRouter();
  const [nationalId, setNationalId] = useState(currentUser?.nationalId || "");
  const [birthDate, setBirthDate] = useState(currentUser?.birthDate || "");
  const [captures, setCaptures] = useState({ card: false, face: false, video: false });
  const [confirmed, setConfirmed] = useState(false);
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);
  if (!currentUser) return null;
  const finishLevel1 = async () => {
    if (!/^\d{10}$/.test(nationalId) || !birthDate) return setMessage({ type: "error", text: "کد ملی ده‌رقمی و تاریخ تولد را کامل کنید." });
    setChecking(true); setMessage({ type: "info", text: "در حال بررسی اطلاعات در سجام…" });
    try {
      const response = await fetch("/api/mock/kyc/sejam", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nationalId, mobile: currentUser.mobile }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "سرویس احراز هویت در دسترس نیست.");
      if (!result.matched) {
        setMessage({ type: "info", text: "اطلاعاتی در سجام یافت نشد؛ استعلام ثبت احوال و تطابق مالکیت موبایل با موفقیت انجام شد." });
        await new Promise((resolve) => setTimeout(resolve, 700));
      }
      updateKyc(1, { nationalId, birthDate, fullName: currentUser.fullName === "کاربر جدید" ? "کاربر احرازشده" : currentUser.fullName });
      setMessage({ type: "success", text: "احراز هویت سطح یک با موفقیت تکمیل شد." });
    } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "خطای نامشخص" }); }
    finally { setChecking(false); }
  };
  const finishLevel2 = async () => {
    setChecking(true); setMessage({ type: "info", text: "در حال ارسال ثبت‌های زنده برای تطبیق فینوتک…" });
    try {
      const response = await fetch("/api/mock/kyc/finnotech", { method: "POST" });
      const result = await response.json();
      if (!response.ok || result.status !== "approved") throw new Error(result.reason || result.message || "تطبیق ناموفق بود.");
      updateKyc(2); setMessage({ type: "success", text: `تطبیق زنده تأیید شد؛ امتیاز چهره ${result.faceScore.toLocaleString("fa-IR")}٪ و زنده‌بودن ${result.livenessScore.toLocaleString("fa-IR")}٪.` });
      setTimeout(() => router.push("/home"), 900);
    } catch (error) { setMessage({ type: "error", text: error instanceof Error ? error.message : "خطای نامشخص" }); }
    finally { setChecking(false); }
  };
  return <AppShell title="احراز هویت">
    <Stepper activeStep={currentUser.kycLevel} alternativeLabel sx={{ mb: 3 }}><Step completed={currentUser.kycLevel >= 1}><StepLabel>پایه</StepLabel></Step><Step completed={currentUser.kycLevel >= 2}><StepLabel>تکمیلی</StepLabel></Step></Stepper>
    {message && <Alert severity={message.type} sx={{ mb: 2 }}>{message.text}</Alert>}
    <Card><CardContent><Typography variant="h2">احراز هویت سطح یک</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5, mb: 2 }}>ابتدا سجام بررسی می‌شود؛ اگر سابقه‌ای وجود نداشته باشد، مسیر ماک ثبت احوال و تطابق کد ملی با مالک موبایل اجرا می‌شود.</Typography><Stack spacing={2}><TextField disabled={currentUser.kycLevel >= 1} label="کد ملی" inputMode="numeric" value={nationalId} onChange={(e) => setNationalId(e.target.value.replace(/\D/g, "").slice(0, 10))} /><TextField disabled={currentUser.kycLevel >= 1} label="تاریخ تولد شمسی" placeholder="۱۳۷۱/۰۲/۲۵" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} /><Alert severity="info">سن بالای ۱۸ سال و یکسان بودن مالک کد ملی و شماره موبایل در پاسخ ماک کنترل می‌شود. کد ملی ۱۱۱۱۱۱۱۱۱۱ سناریوی «فاقد سجام» است.</Alert><FormControlLabel control={<Checkbox disabled={currentUser.kycLevel >= 1} checked={confirmed || currentUser.kycLevel >= 1} onChange={(e) => setConfirmed(e.target.checked)} />} label="صحت اطلاعات و شرایط استفاده را تأیید می‌کنم" /><Button disabled={!confirmed || currentUser.kycLevel >= 1 || checking} variant="contained" onClick={finishLevel1}>{checking ? <CircularProgress size={22} color="inherit" /> : currentUser.kycLevel >= 1 ? "سطح یک تکمیل شده" : "بررسی سجام و تکمیل احراز"}</Button></Stack></CardContent></Card>
    <Card sx={{ mt: 2 }}><CardContent><Typography variant="h2">احراز هویت سطح دو</Typography><Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>هر سه مدرک فقط به‌صورت زنده از دوربین ثبت می‌شوند؛ انتخاب یا بارگذاری فایل غیرفعال است.</Typography><Stack spacing={1.5}><LiveCameraCapture title="تصویر کارت ملی" description="کارت را مقابل دوربین پشت قرار دهید" mode="photo" facingMode="environment" completed={captures.card} onCapture={() => setCaptures((v) => ({ ...v, card: true }))} /><LiveCameraCapture title="تصویر زنده چهره" description="صورت در مرکز کادر و نور کافی باشد" mode="photo" facingMode="user" completed={captures.face} onCapture={() => setCaptures((v) => ({ ...v, face: true }))} /><LiveCameraCapture title="ویدئوی زنده" description="ویدئوی کوتاه با دوربین جلو ضبط کنید" mode="video" facingMode="user" completed={captures.video} onCapture={() => setCaptures((v) => ({ ...v, video: true }))} /><Button disabled={!Object.values(captures).every(Boolean) || currentUser.kycLevel < 1 || currentUser.kycLevel >= 2 || checking} variant="contained" onClick={finishLevel2}>{currentUser.kycLevel >= 2 ? "سطح دو تکمیل شده" : "ارسال ثبت‌های زنده به فینوتک"}</Button></Stack></CardContent></Card>
  </AppShell>;
}
