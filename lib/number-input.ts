const persianDigits = "۰۱۲۳۴۵۶۷۸۹";
const arabicDigits = "٠١٢٣٤٥٦٧٨٩";

export function parseGroupedNumber(value: string): number {
  const normalized = value
    .replace(/[۰-۹]/g, (digit) => String(persianDigits.indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String(arabicDigits.indexOf(digit)))
    .replace(/[^0-9]/g, "");
  return normalized ? Number(normalized) : 0;
}

export function groupedNumber(value: number | string): string {
  const number = typeof value === "number" ? value : parseGroupedNumber(value);
  return Number.isFinite(number) ? new Intl.NumberFormat("fa-IR").format(number) : "";
}

export const groupedNumberInputProps = {
  inputMode: "numeric" as const,
  style: { direction: "ltr" as const, textAlign: "right" as const },
};
