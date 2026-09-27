export type Role = "customer" | "merchant" | "admin";
export type KycLevel = 0 | 1 | 2;
export type AssetKind = "fund" | "insurance";
export type AssetStatus = "pending" | "active" | "failed";
export type CreditStatus = "initial" | "available" | "cancelled" | "spent" | "evaluating" | "contract";

export interface User {
  id: string;
  mobile: string;
  fullName: string;
  nationalId: string;
  birthDate: string;
  role: Role;
  kycLevel: KycLevel;
  active: boolean;
}

export interface AssetProduct {
  id: string;
  title: string;
  kind: AssetKind;
  description: string;
  unitLabel: string;
  minPurchase: number;
  mockDailyChange: number;
}

export interface AssetHolding {
  id: string;
  userId: string;
  productId: string;
  title: string;
  kind: AssetKind;
  purchaseAmount: number;
  currentValue: number;
  blockedAmount: number;
  status: AssetStatus;
  createdAt: string;
}

export interface CreditPlan {
  id: string;
  title: string;
  financeProvider: string;
  minAmount: number;
  maxAmount: number;
  months: number[];
  profitRate: number;
  feeRate: number;
  collateralRatio: number;
  active: boolean;
  isAvailableInHummersApp: boolean;
}

export interface CreditRequest {
  id: string;
  userId: string;
  planId: string;
  planTitle: string;
  requestedAmount: number;
  blockedAmount: number;
  duration: number;
  status: CreditStatus;
  evaluationStep: number;
  createdAt: string;
  contractNumber?: string;
  invoiceId?: string;
}

export interface Product {
  id: string;
  merchantId: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  description: string;
  active: boolean;
}

export interface InvoiceItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  tax: number;
}

export interface Invoice {
  id: string;
  merchantId: string;
  merchantName: string;
  customerId: string;
  customerNationalId: string;
  items: InvoiceItem[];
  totalAmount: number;
  creditAmount: number;
  cashAmount: number;
  status: "awaiting-customer" | "approved" | "rejected";
  createdAt: string;
}

export interface Contract {
  id: string;
  creditRequestId: string;
  userId: string;
  contractNumber: string;
  principal: number;
  months: number;
  installmentAmount: number;
  nextDueDate: string;
  overdueAmount: number;
  penaltyAmount: number;
  paidInstallments: number;
}

export interface Settlement {
  id: string;
  merchantId: string;
  amount: number;
  status: "pending" | "settled";
  createdAt: string;
  settledAt?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
}

export interface AppState {
  users: User[];
  assetProducts: AssetProduct[];
  assets: AssetHolding[];
  creditPlans: CreditPlan[];
  creditRequests: CreditRequest[];
  products: Product[];
  invoices: Invoice[];
  contracts: Contract[];
  settlements: Settlement[];
  notifications: AppNotification[];
}
