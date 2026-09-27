import { Chip } from "@mui/material";

const config: Record<string, { label: string; color: "default" | "success" | "warning" | "error" | "primary" }> = {
  pending: { label: "در انتظار صدور", color: "warning" }, active: { label: "فعال", color: "success" }, failed: { label: "ناموفق", color: "error" },
  initial: { label: "ثبت اولیه", color: "default" }, available: { label: "آماده خرید", color: "success" }, cancelled: { label: "لغوشده", color: "default" }, spent: { label: "مصرف‌شده", color: "primary" }, evaluating: { label: "در حال ارزیابی", color: "warning" }, contract: { label: "قرارداد", color: "success" },
  "awaiting-customer": { label: "منتظر تأیید مشتری", color: "warning" }, approved: { label: "تأییدشده", color: "success" }, rejected: { label: "ردشده", color: "error" }, settled: { label: "تسویه‌شده", color: "success" },
};

export default function StatusPill({ status }: { status: string }) {
  const item = config[status] || { label: status, color: "default" as const };
  return <Chip size="small" label={item.label} color={item.color} variant={item.color === "default" ? "outlined" : "filled"} />;
}
