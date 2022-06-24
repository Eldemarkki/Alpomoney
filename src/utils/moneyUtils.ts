const moneyFormat = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export const centify = (amount: number): number => Math.round(amount * 100);
export const decentify = (amount: number): number => amount / 100;
export const moneyToString = (cents: number): string => moneyFormat.format(cents / 100);
