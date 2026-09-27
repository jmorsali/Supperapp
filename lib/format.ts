export const money = (value: number) => `${new Intl.NumberFormat("fa-IR").format(Math.round(value))} تومان`;
export const faNumber = (value: number | string) => new Intl.NumberFormat("fa-IR").format(Number(value));
export const shortDate = (value: string) => new Intl.DateTimeFormat("fa-IR", { year: "numeric", month: "long", day: "numeric" }).format(new Date(value));
export const uid = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 7)}`;
