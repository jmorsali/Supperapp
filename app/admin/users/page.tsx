"use client";

import { useState } from "react";
import { Card, CardContent, Chip, InputAdornment, Stack, Switch, TextField, Typography } from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import AppShell from "@/components/AppShell";
import { useApp } from "@/contexts/AppContext";

export default function AdminUsersPage() {
  const { state, toggleUser } = useApp();
  const [query, setQuery] = useState("");
  const users = state.users.filter((u) => u.role === "customer" && `${u.fullName}${u.mobile}${u.nationalId}`.includes(query));
  return <AppShell title="کاربران"><TextField sx={{ mb: 2 }} placeholder="جست‌وجوی نام، موبایل یا کد ملی" value={query} onChange={(e) => setQuery(e.target.value)} InputProps={{ startAdornment: <InputAdornment position="start"><SearchRounded /></InputAdornment> }} /><Stack spacing={1.2}>{users.map((u) => <Card key={u.id}><CardContent><Stack direction="row" justifyContent="space-between"><div><Typography fontWeight={900}>{u.fullName}</Typography><Typography variant="body2" color="text.secondary">{u.mobile} • {u.nationalId || "بدون احراز هویت"}</Typography><Chip size="small" sx={{ mt: 1 }} label={`احراز سطح ${u.kycLevel.toLocaleString("fa-IR")}`} color={u.kycLevel ? "success" : "warning"} /></div><Switch checked={u.active} onChange={() => toggleUser(u.id)} /></Stack></CardContent></Card>)}</Stack></AppShell>;
}
