"use client";

import { useEffect } from "react";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import AppShell from "@/components/AppShell";
import EmptyState from "@/components/EmptyState";
import { useApp } from "@/contexts/AppContext";
import { shortDate } from "@/lib/format";

export default function NotificationsPage() {
  const { state, currentUser, markNotificationsRead } = useApp();
  useEffect(() => { if (currentUser) markNotificationsRead(); }, [currentUser, markNotificationsRead]);
  if (!currentUser) return null;
  const items = state.notifications.filter((n) => n.userId === currentUser.id);
  const enableNotifications = async () => { if ("Notification" in window) await Notification.requestPermission(); };
  return <AppShell title="اعلان‌ها"><Button variant="outlined" fullWidth onClick={enableNotifications} sx={{ mb: 2 }}>فعال‌سازی اعلان مرورگر</Button>{!items.length ? <Card><EmptyState title="اعلانی ندارید" description="رویدادهای مهم در این بخش نمایش داده می‌شوند." /></Card> : <Stack spacing={1.25}>{items.map((item) => <Card key={item.id}><CardContent><Typography sx={{ fontWeight: 900 }}>{item.title}</Typography><Typography variant="body2" sx={{ my: .75 }}>{item.body}</Typography><Typography variant="caption" color="text.secondary">{shortDate(item.createdAt)}</Typography></CardContent></Card>)}</Stack>}</AppShell>;
}
