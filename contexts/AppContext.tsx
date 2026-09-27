"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { AppState, CreditRequest, InvoiceItem, KycLevel, User } from "@/lib/types";
import { loadState, resetState, saveState } from "@/lib/storage";
import { uid } from "@/lib/format";

type LoginResult = { ok: true } | { ok: false; error: string };

interface AppContextValue {
  state: AppState;
  currentUser: User | null;
  ready: boolean;
  otpMobile: string;
  requestOtp: (mobile: string) => LoginResult;
  verifyOtp: (code: string) => LoginResult;
  logout: () => void;
  updateKyc: (level: KycLevel, data?: Partial<User>) => void;
  buyAsset: (productId: string, amount: number) => string;
  setAssetStatus: (id: string, status: "active" | "failed") => void;
  redeemAsset: (id: string, amount: number) => LoginResult;
  requestCredit: (planId: string, amount: number, duration: number) => LoginResult;
  cancelCredit: (id: string) => void;
  createInvoice: (nationalId: string, items: InvoiceItem[], creditAmount: number) => LoginResult;
  decideInvoice: (id: string, approve: boolean) => LoginResult;
  advanceEvaluation: (id: string) => void;
  payInstallment: (id: string) => void;
  addProduct: (data: Omit<AppState["products"][number], "id" | "merchantId">) => void;
  updateProduct: (id: string, patch: Partial<AppState["products"][number]>) => void;
  requestSettlement: (amount: number) => LoginResult;
  completeSettlement: (id: string) => void;
  toggleUser: (id: string) => void;
  togglePlan: (id: string) => void;
  liquidateCollateral: (contractId: string, assetId: string) => LoginResult;
  markNotificationsRead: () => void;
  resetDemo: () => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

const notify = (state: AppState, userId: string, title: string, body: string) => ({
  ...state,
  notifications: [{ id: uid("n"), userId, title, body, read: false, createdAt: new Date().toISOString() }, ...state.notifications],
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({ users: [], assetProducts: [], assets: [], creditPlans: [], creditRequests: [], products: [], invoices: [], contracts: [], settlements: [], notifications: [] });
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [otpMobile, setOtpMobile] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadState()
      .catch(() => resetState())
      .then((data) => {
        setState(data);
        setCurrentUserId(localStorage.getItem("hummers-session"));
      })
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) saveState(state);
  }, [ready, state]);

  const currentUser = state.users.find((u) => u.id === currentUserId) || null;
  const change = useCallback((recipe: (previous: AppState) => AppState) => setState((previous) => recipe(previous)), []);

  const requestOtp = (mobile: string): LoginResult => {
    if (!/^09\d{9}$/.test(mobile)) return { ok: false, error: "شماره موبایل معتبر نیست." };
    setOtpMobile(mobile);
    return { ok: true };
  };

  const verifyOtp = (code: string): LoginResult => {
    if (code !== "12345") return { ok: false, error: "کد تأیید نادرست است. کد دمو ۱۲۳۴۵ است." };
    let user = state.users.find((u) => u.mobile === otpMobile);
    if (!user) {
      user = { id: uid("u"), mobile: otpMobile, fullName: "کاربر جدید", nationalId: "", birthDate: "", role: "customer", kycLevel: 0, active: true };
      setState((previous) => ({ ...previous, users: [...previous.users, user!] }));
    }
    if (!user.active) return { ok: false, error: "حساب کاربری غیرفعال است." };
    localStorage.setItem("hummers-session", user.id);
    setCurrentUserId(user.id);
    return { ok: true };
  };

  const logout = () => {
    localStorage.removeItem("hummers-session");
    setCurrentUserId(null);
    setOtpMobile("");
  };

  const updateKyc = (level: KycLevel, data: Partial<User> = {}) => change((previous) => ({
    ...previous,
    users: previous.users.map((u) => u.id === currentUserId ? { ...u, ...data, kycLevel: level } : u),
  }));

  const buyAsset = (productId: string, amount: number) => {
    const product = state.assetProducts.find((p) => p.id === productId)!;
    const id = uid("asset");
    change((previous) => notify({
      ...previous,
      assets: [{ id, userId: currentUserId!, productId, title: product.title, kind: product.kind, purchaseAmount: amount, currentValue: amount, blockedAmount: 0, status: "pending", createdAt: new Date().toISOString() }, ...previous.assets],
    }, currentUserId!, "درخواست خرید ثبت شد", `صدور ${product.title} در حال انجام است.`));
    return id;
  };

  const setAssetStatus = (id: string, status: "active" | "failed") => change((previous) => {
    const asset = previous.assets.find((a) => a.id === id)!;
    return notify({ ...previous, assets: previous.assets.map((a) => a.id === id ? { ...a, status } : a) }, asset.userId, status === "active" ? "دارایی صادر شد" : "صدور دارایی ناموفق بود", status === "active" ? `${asset.title} به کیف دارایی اضافه شد.` : `مبلغ خرید ${asset.title} قابل بازگشت است.`);
  });

  const redeemAsset = (id: string, amount: number): LoginResult => {
    const asset = state.assets.find((a) => a.id === id && a.userId === currentUserId);
    if (!asset || amount <= 0 || amount > asset.currentValue - asset.blockedAmount) return { ok: false, error: "مبلغ ابطال از بخش آزاد دارایی بیشتر است." };
    change((previous) => ({ ...previous, assets: previous.assets.map((a) => a.id === id ? { ...a, currentValue: a.currentValue - amount } : a) }));
    return { ok: true };
  };

  const requestCredit = (planId: string, amount: number, duration: number): LoginResult => {
    if (!currentUser || currentUser.kycLevel < 1) return { ok: false, error: "ابتدا احراز هویت سطح یک را تکمیل کنید." };
    if (state.creditRequests.some((r) => r.userId === currentUser.id && ["initial", "available"].includes(r.status))) return { ok: false, error: "یک اعتبار فعال یا در انتظار خرید دارید." };
    const plan = state.creditPlans.find((p) => p.id === planId);
    if (!plan || !plan.active || !plan.isAvailableInHummersApp) return { ok: false, error: "طرح انتخاب‌شده در دسترس نیست." };
    const blockedAmount = Math.ceil(amount / 0.7);
    const freeAssets = state.assets.filter((a) => a.userId === currentUser.id && a.status === "active").reduce((sum, a) => sum + a.currentValue - a.blockedAmount, 0);
    if (amount < plan.minAmount || amount > plan.maxAmount) return { ok: false, error: "مبلغ خارج از بازه مجاز طرح است." };
    if (freeAssets < blockedAmount) return { ok: false, error: "ارزش آزاد دارایی برای وثیقه کافی نیست." };
    const request: CreditRequest = { id: uid("credit"), userId: currentUser.id, planId, planTitle: plan.title, requestedAmount: amount, blockedAmount, duration, status: "available", evaluationStep: 0, createdAt: new Date().toISOString() };
    let remaining = blockedAmount;
    change((previous) => notify({
      ...previous,
      creditRequests: [request, ...previous.creditRequests],
      assets: previous.assets.map((asset) => {
        if (asset.userId !== currentUser.id || asset.status !== "active" || remaining <= 0) return asset;
        const free = asset.currentValue - asset.blockedAmount;
        const block = Math.min(free, remaining);
        remaining -= block;
        return { ...asset, blockedAmount: asset.blockedAmount + block };
      }),
    }, currentUser.id, "اعتبار آماده استفاده است", `${plan.title} فعال شد و تا اولین خرید قابل استفاده است.`));
    return { ok: true };
  };

  const cancelCredit = (id: string) => change((previous) => {
    const request = previous.creditRequests.find((r) => r.id === id)!;
    let remaining = request.blockedAmount;
    return notify({
      ...previous,
      creditRequests: previous.creditRequests.map((r) => r.id === id ? { ...r, status: "cancelled" } : r),
      assets: previous.assets.map((asset) => {
        if (asset.userId !== request.userId || remaining <= 0) return asset;
        const release = Math.min(asset.blockedAmount, remaining);
        remaining -= release;
        return { ...asset, blockedAmount: asset.blockedAmount - release };
      }),
    }, request.userId, "اعتبار لغو شد", "وثیقه مسدودشده آزاد شد.");
  });

  const createInvoice = (nationalId: string, items: InvoiceItem[], creditAmount: number): LoginResult => {
    const customer = state.users.find((u) => u.nationalId === nationalId && u.role === "customer");
    if (!customer) return { ok: false, error: "مشتری یافت نشد." };
    const credit = state.creditRequests.find((r) => r.userId === customer.id && r.status === "available");
    if (!credit || creditAmount > credit.requestedAmount) return { ok: false, error: "اعتبار قابل استفاده کافی نیست." };
    const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.unitPrice - item.discount + item.tax, 0);
    if (!items.length || creditAmount <= 0 || creditAmount > totalAmount) return { ok: false, error: "مبلغ یا اقلام فاکتور معتبر نیست." };
    const invoice = { id: uid("invoice"), merchantId: currentUserId!, merchantName: currentUser?.fullName || "فروشگاه", customerId: customer.id, customerNationalId: nationalId, items, totalAmount, creditAmount, cashAmount: totalAmount - creditAmount, status: "awaiting-customer" as const, createdAt: new Date().toISOString() };
    change((previous) => notify({ ...previous, invoices: [invoice, ...previous.invoices] }, customer.id, "فاکتور اعتباری جدید", `فاکتور ${invoice.merchantName} منتظر تأیید شماست.`));
    return { ok: true };
  };

  const decideInvoice = (id: string, approve: boolean): LoginResult => {
    const invoice = state.invoices.find((item) => item.id === id);
    if (!invoice || invoice.customerId !== currentUserId || invoice.status !== "awaiting-customer") return { ok: false, error: "فاکتور قابل تأیید نیست." };
    const credit = state.creditRequests.find((r) => r.userId === currentUserId && r.status === "available");
    if (!credit) return { ok: false, error: "اعتبار فعال یافت نشد." };
    change((previous) => {
      let next: AppState = {
        ...previous,
        invoices: previous.invoices.map((item) => item.id === id ? { ...item, status: approve ? "approved" : "rejected" } : item),
      };
      if (!approve) return notify(next, invoice.merchantId, "فاکتور رد شد", "مشتری فاکتور اعتباری را رد کرد.");
      const requiredBlock = Math.ceil(invoice.creditAmount / 0.7);
      let release = Math.max(0, credit.blockedAmount - requiredBlock);
      next = {
        ...next,
        creditRequests: next.creditRequests.map((r) => r.id === credit.id ? { ...r, requestedAmount: invoice.creditAmount, blockedAmount: requiredBlock, status: "evaluating", evaluationStep: 0, invoiceId: id } : r),
        assets: next.assets.map((asset) => {
          if (asset.userId !== currentUserId || release <= 0) return asset;
          const freed = Math.min(asset.blockedAmount, release);
          release -= freed;
          return { ...asset, blockedAmount: asset.blockedAmount - freed };
        }),
        products: next.products.map((product) => {
          const item = invoice.items.find((i) => i.productId === product.id);
          return item ? { ...product, stock: Math.max(0, product.stock - item.quantity) } : product;
        }),
      };
      next = notify(next, invoice.merchantId, "فروش اعتباری تأیید شد", `مبلغ ${invoice.creditAmount.toLocaleString("fa-IR")} تومان به موجودی در انتظار تسویه افزوده شد.`);
      return notify(next, currentUserId!, "خرید با موفقیت ثبت شد", "پرونده برای ارزیابی سه‌مرحله‌ای به لیزینگ ارسال شد.");
    });
    return { ok: true };
  };

  const advanceEvaluation = (id: string) => change((previous) => {
    const request = previous.creditRequests.find((r) => r.id === id)!;
    const nextStep = request.evaluationStep + 1;
    if (nextStep < 3) return notify({ ...previous, creditRequests: previous.creditRequests.map((r) => r.id === id ? { ...r, evaluationStep: nextStep } : r) }, request.userId, "پرونده در حال ارزیابی است", `ارزیاب مرحله ${nextStep.toLocaleString("fa-IR")} پرونده را تأیید کرد.`);
    const invoice = previous.invoices.find((i) => i.id === request.invoiceId)!;
    const plan = previous.creditPlans.find((p) => p.id === request.planId)!;
    const contractNumber = `HM-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`;
    const total = invoice.creditAmount * (1 + plan.profitRate / 100);
    const next: AppState = {
      ...previous,
      creditRequests: previous.creditRequests.map((r) => r.id === id ? { ...r, evaluationStep: 3, status: "contract", contractNumber } : r),
      contracts: [{ id: uid("contract"), creditRequestId: id, userId: request.userId, contractNumber, principal: invoice.creditAmount, months: request.duration, installmentAmount: Math.ceil(total / request.duration), nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString(), overdueAmount: 0, penaltyAmount: 0, paidInstallments: 0 }, ...previous.contracts],
      settlements: [{ id: uid("settle"), merchantId: invoice.merchantId, amount: invoice.creditAmount, status: "pending", createdAt: new Date().toISOString() }, ...previous.settlements],
    };
    return notify(next, request.userId, "قرارداد تسهیلات تشکیل شد", `شماره قرارداد ${contractNumber} صادر شد.`);
  });

  const payInstallment = (id: string) => change((previous) => ({ ...previous, contracts: previous.contracts.map((c) => c.id === id ? { ...c, paidInstallments: Math.min(c.months, c.paidInstallments + 1), overdueAmount: 0, penaltyAmount: 0, nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString() } : c) }));
  const addProduct = (data: Omit<AppState["products"][number], "id" | "merchantId">) => change((previous) => ({ ...previous, products: [{ ...data, id: uid("prd"), merchantId: currentUserId! }, ...previous.products] }));
  const updateProduct = (id: string, patch: Partial<AppState["products"][number]>) => change((previous) => ({ ...previous, products: previous.products.map((p) => p.id === id ? { ...p, ...patch } : p) }));

  const requestSettlement = (amount: number): LoginResult => {
    const available = state.settlements.filter((s) => s.merchantId === currentUserId && s.status === "pending").reduce((sum, s) => sum + s.amount, 0);
    if (amount <= 0 || amount > available) return { ok: false, error: "مبلغ درخواست از موجودی در انتظار بیشتر است." };
    return { ok: true };
  };
  const completeSettlement = (id: string) => change((previous) => ({ ...previous, settlements: previous.settlements.map((s) => s.id === id ? { ...s, status: "settled", settledAt: new Date().toISOString() } : s) }));
  const toggleUser = (id: string) => change((previous) => ({ ...previous, users: previous.users.map((u) => u.id === id ? { ...u, active: !u.active } : u) }));
  const togglePlan = (id: string) => change((previous) => ({ ...previous, creditPlans: previous.creditPlans.map((p) => p.id === id ? { ...p, isAvailableInHummersApp: !p.isAvailableInHummersApp } : p) }));

  const liquidateCollateral = (contractId: string, assetId: string): LoginResult => {
    const contract = state.contracts.find((c) => c.id === contractId);
    const asset = state.assets.find((a) => a.id === assetId);
    if (!contract || !asset) return { ok: false, error: "اطلاعات قرارداد یا دارایی یافت نشد." };
    const due = contract.overdueAmount + contract.penaltyAmount;
    if (due <= 0 || asset.currentValue < due) return { ok: false, error: "این دارایی برای برداشت انتخابی مناسب نیست." };
    change((previous) => notify({
      ...previous,
      assets: previous.assets.map((a) => a.id === assetId ? { ...a, currentValue: a.currentValue - due, blockedAmount: Math.max(0, a.blockedAmount - due) } : a),
      contracts: previous.contracts.map((c) => c.id === contractId ? { ...c, overdueAmount: 0, penaltyAmount: 0 } : c),
    }, contract.userId, "بدهی معوق از وثیقه وصول شد", "مبلغ قسط و جریمه از دارایی انتخابی برداشت شد."));
    return { ok: true };
  };

  const markNotificationsRead = useCallback(() => change((previous) => ({ ...previous, notifications: previous.notifications.map((n) => n.userId === currentUserId ? { ...n, read: true } : n) })), [change, currentUserId]);
  const resetDemo = async () => { const next = await resetState(); setState(next); };

  const value: AppContextValue = { state, currentUser, ready, otpMobile, requestOtp, verifyOtp, logout, updateKyc, buyAsset, setAssetStatus, redeemAsset, requestCredit, cancelCredit, createInvoice, decideInvoice, advanceEvaluation, payInstallment, addProduct, updateProduct, requestSettlement, completeSettlement, toggleUser, togglePlan, liquidateCollateral, markNotificationsRead, resetDemo };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};
