"use client";

import Link from "next/link";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, LinearProgress, Stack, Typography } from "@mui/material";
import AccountBalanceWalletRounded from "@mui/icons-material/AccountBalanceWalletRounded";
import CreditScoreRounded from "@mui/icons-material/CreditScoreRounded";
import ShoppingBagRounded from "@mui/icons-material/ShoppingBagRounded";
import ReceiptLongRounded from "@mui/icons-material/ReceiptLongRounded";
import AppShell from "@/components/AppShell";
import StatusPill from "@/components/StatusPill";
import { useApp } from "@/contexts/AppContext";
import { money, shortDate } from "@/lib/format";

export default function HomePage() {
  const { state, currentUser } = useApp();
  if (!currentUser) return null;
  const assets = state.assets.filter((a) => a.userId === currentUser.id);
  const totalAssets = assets.reduce((s, a) => s + a.currentValue, 0);
  const blocked = assets.reduce((s, a) => s + a.blockedAmount, 0);
  const activeCredit = state.creditRequests.find((r) => r.userId === currentUser.id && ["available", "evaluating"].includes(r.status));
  const nextContract = state.contracts.filter((c) => c.userId === currentUser.id && c.paidInstallments < c.months).sort((a, b) => +new Date(a.nextDueDate) - +new Date(b.nextDueDate))[0];
  const pendingInvoice = state.invoices.find((i) => i.customerId === currentUser.id && i.status === "awaiting-customer");

  return <AppShell title={`سلام، ${currentUser.fullName}`}>
    {currentUser.kycLevel === 0 && <Alert severity="warning" action={<Button component={Link} href="/kyc" color="inherit" size="small">شروع احراز</Button>} sx={{ mb: 2 }}>اطلاعات شما در سجام یافت نشده یا هنوز بررسی نشده است. برای فعال شدن خرید دارایی و اعتبار به بخش احراز هویت بروید.</Alert>}
    {pendingInvoice && <Alert severity="info" action={<Button component={Link} href="/invoices" color="inherit" size="small">مشاهده</Button>} sx={{ mb: 2 }}>یک فاکتور اعتباری منتظر تأیید شماست.</Alert>}
    <Card component={Link} href="/kyc" sx={{ display: "block", mb: 2, borderColor: currentUser.kycLevel ? "success.light" : "warning.light" }}><CardContent sx={{ py: "14px!important", display: "flex", justifyContent: "space-between", alignItems: "center" }}><Box><Typography fontWeight={900}>وضعیت احراز هویت</Typography><Typography variant="caption" color="text.secondary">{currentUser.kycLevel === 0 ? "نیازمند تکمیل اطلاعات هویتی" : currentUser.kycLevel === 1 ? "اطلاعات پایه تأیید شده است" : "هویت و زنده‌بودن چهره تأیید شده است"}</Typography></Box><Chip color={currentUser.kycLevel ? "success" : "warning"} label={currentUser.kycLevel === 0 ? "تکمیل نشده" : `سطح ${currentUser.kycLevel.toLocaleString("fa-IR")}`} /></CardContent></Card>
    <Card sx={{ color: "white", background: "linear-gradient(135deg,#0050A7,#00366F)", overflow: "visible" }}><CardContent sx={{ p: 2.5 }}>
      <Typography sx={{ opacity: .72, fontSize: 12 }}>ارزش کل دارایی</Typography><Typography sx={{ fontSize: 25, fontWeight: 900, mt: .5 }}>{money(totalAssets)}</Typography>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}><Box><Typography sx={{ opacity: .65, fontSize: 11 }}>دارایی آزاد</Typography><Typography sx={{ fontWeight: 800 }}>{money(totalAssets - blocked)}</Typography></Box><Box><Typography sx={{ opacity: .65, fontSize: 11 }}>وثیقه مسدود</Typography><Typography sx={{ fontWeight: 800 }}>{money(blocked)}</Typography></Box></Stack>
    </CardContent></Card>
    <Grid container spacing={1.5} sx={{ mt: .5 }}>
      {[{ href: "/assets/buy", title: "خرید دارایی", icon: ShoppingBagRounded }, { href: "/credit", title: "دریافت اعتبار", icon: CreditScoreRounded }, { href: "/assets", title: "کیف دارایی", icon: AccountBalanceWalletRounded }, { href: "/debts", title: "مدیریت بدهی", icon: ReceiptLongRounded }].map(({ href, title, icon: Icon }) => <Grid size={6} key={href}><Card component={Link} href={href} sx={{ display: "block" }}><CardContent sx={{ display: "flex", alignItems: "center", gap: 1.2, p: "14px!important" }}><Box sx={{ width: 40, height: 40, borderRadius: 2.5, display: "grid", placeItems: "center", bgcolor: "primary.light", color: "primary.main" }}><Icon /></Box><Typography sx={{ fontSize: 12, fontWeight: 800 }}>{title}</Typography></CardContent></Card></Grid>)}
    </Grid>
    {activeCredit && <Box sx={{ mt: 3 }}><Typography variant="h2" sx={{ mb: 1.25 }}>اعتبار فعال</Typography><Card><CardContent><Stack direction="row" justifyContent="space-between"><Box><Typography sx={{ fontWeight: 800 }}>{activeCredit.planTitle}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: .5 }}>{money(activeCredit.requestedAmount)}</Typography></Box><StatusPill status={activeCredit.status} /></Stack>{activeCredit.status === "evaluating" && <Box sx={{ mt: 2 }}><LinearProgress variant="determinate" value={(activeCredit.evaluationStep / 3) * 100} /><Typography variant="caption" color="text.secondary">تأیید {activeCredit.evaluationStep.toLocaleString("fa-IR")} از ۳ ارزیاب</Typography></Box>}</CardContent></Card></Box>}
    {nextContract && <Box sx={{ mt: 3 }}><Typography variant="h2" sx={{ mb: 1.25 }}>قسط پیش رو</Typography><Card><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center"><Box><Typography sx={{ fontWeight: 800 }}>{money(nextContract.installmentAmount)}</Typography><Typography variant="body2" color="text.secondary">سررسید {shortDate(nextContract.nextDueDate)}</Typography></Box><Button component={Link} href="/debts" variant="outlined">مشاهده</Button></Stack></CardContent></Card></Box>}
  </AppShell>;
}
