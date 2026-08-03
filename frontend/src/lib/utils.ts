import { format, parseISO } from "date-fns";

/**
 * Formats a number as BDT currency, e.g. ৳ 1,250.00
 */
export function formatCurrency(amount: number | string): string {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (Number.isNaN(value)) return "৳ 0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "BDT",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(value)
    .replace("BDT", "৳");
}

/**
 * Formats an ISO date string (yyyy-MM-dd) into a readable display date, e.g. "12 Aug 2026"
 */
export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), "dd MMM yyyy");
  } catch {
    return dateStr;
  }
}

/**
 * Returns the current month in yyyy-MM format.
 */
export function currentMonth(): string {
  return format(new Date(), "yyyy-MM");
}

/**
 * Formats a yyyy-MM string into a readable month/year, e.g. "August 2026"
 */
export function formatMonthLabel(monthStr: string): string {
  try {
    return format(parseISO(`${monthStr}-01`), "MMMM yyyy");
  } catch {
    return monthStr;
  }
}

export function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
