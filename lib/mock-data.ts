import { AppState } from "./types";

const now = new Date();
const iso = (offsetDays = 0) => new Date(now.getTime() + offsetDays * 86400000).toISOString();

export const demoMobiles = {
  customer: "09120000001",
  merchant: "09120000002",
  admin: "09120000003",
};

export const initialState: AppState = {
  users: [
    { id: "u-customer", mobile: demoMobiles.customer, fullName: "علی محمدی", nationalId: "0012345678", birthDate: "1371/02/25", role: "customer", kycLevel: 1, active: true },
    { id: "u-merchant", mobile: demoMobiles.merchant, fullName: "مدیر فروشگاه دیدار", nationalId: "0045678901", birthDate: "1365/05/12", role: "merchant", kycLevel: 2, active: true },
    { id: "u-admin", mobile: demoMobiles.admin, fullName: "مدیر سامانه", nationalId: "0078901234", birthDate: "1360/01/01", role: "admin", kycLevel: 2, active: true },
    { id: "u-pending", mobile: "09121112233", fullName: "کاربر جدید", nationalId: "", birthDate: "", role: "customer", kycLevel: 0, active: true },
  ],
  assetProducts: [
    { id: "ap-fund", title: "صندوق سیمرغ هامرز", kind: "fund", description: "صندوق صدور و ابطالی با ارزش‌گذاری روزانه", unitLabel: "واحد", minPurchase: 1_000_000, mockDailyChange: 1.8 },
    { id: "ap-insurance", title: "بیمه عمر با پشتوانه طلای هامرز", kind: "insurance", description: "بیمه عمر با اندوخته مبتنی بر طلا", unitLabel: "بیمه‌نامه", minPurchase: 1_000_000, mockDailyChange: 0.9 },
  ],
  assets: [
    { id: "a-1", userId: "u-customer", productId: "ap-fund", title: "صندوق سیمرغ هامرز", kind: "fund", purchaseAmount: 180_000_000, currentValue: 192_000_000, blockedAmount: 0, status: "active", createdAt: iso(-80) },
    { id: "a-2", userId: "u-customer", productId: "ap-insurance", title: "بیمه عمر با پشتوانه طلای هامرز", kind: "insurance", purchaseAmount: 60_000_000, currentValue: 64_500_000, blockedAmount: 0, status: "active", createdAt: iso(-40) },
  ],
  creditPlans: [
    { id: "p-1", title: "خرید آسان هامرز", financeProvider: "لیزینگ هامرز", minAmount: 20_000_000, maxAmount: 150_000_000, months: [6, 12], profitRate: 18, feeRate: 1.5, collateralRatio: 70, active: true, isAvailableInHummersApp: true },
    { id: "p-2", title: "اعتبار ویژه کالا", financeProvider: "لیزینگ هامرز", minAmount: 50_000_000, maxAmount: 300_000_000, months: [12, 18, 24], profitRate: 21, feeRate: 2, collateralRatio: 70, active: true, isAvailableInHummersApp: true },
    { id: "p-3", title: "طرح سازمانی", financeProvider: "لیزینگ هامرز", minAmount: 100_000_000, maxAmount: 500_000_000, months: [24, 36], profitRate: 20, feeRate: 2, collateralRatio: 70, active: true, isAvailableInHummersApp: false },
  ],
  creditRequests: [],
  products: [
    { id: "prd-1", merchantId: "u-merchant", name: "تلویزیون هوشمند ۵۵ اینچ", sku: "TV-55-01", category: "صوتی و تصویری", price: 150_000_000, stock: 8, description: "نمایشگر 4K با ضمانت هجده‌ماهه", active: true },
    { id: "prd-2", merchantId: "u-merchant", name: "گوشی هوشمند", sku: "MOB-256", category: "کالای دیجیتال", price: 72_000_000, stock: 14, description: "حافظه ۲۵۶ گیگابایت", active: true },
    { id: "prd-3", merchantId: "u-merchant", name: "ماشین لباسشویی", sku: "WM-9K", category: "لوازم خانگی", price: 98_000_000, stock: 5, description: "ظرفیت ۹ کیلوگرم", active: true },
  ],
  invoices: [],
  contracts: [
    { id: "c-1", creditRequestId: "legacy", userId: "u-customer", contractNumber: "HM-1405-10241", principal: 48_000_000, months: 12, installmentAmount: 4_720_000, nextDueDate: iso(8), overdueAmount: 0, penaltyAmount: 0, paidInstallments: 4 },
    { id: "c-2", creditRequestId: "legacy-2", userId: "u-customer", contractNumber: "HM-1404-09118", principal: 30_000_000, months: 6, installmentAmount: 5_450_000, nextDueDate: iso(-14), overdueAmount: 5_450_000, penaltyAmount: 180_000, paidInstallments: 3 },
  ],
  settlements: [],
  notifications: [
    { id: "n-1", userId: "u-customer", title: "به Hummers خوش آمدید", body: "کیف دارایی و وضعیت اقساط شما آماده مشاهده است.", read: false, createdAt: iso(-1) },
  ],
};
