import { RecurringTransactionFrequency } from "@prisma/client";

export type ConvertDates<T> = {
  [k in keyof T]: (T[k] extends Date ? number : T[k]);
}

export function hasKey<K extends string>(o: unknown, k: K): o is { [_ in K]: unknown } {
  return typeof o === "object" && k in o;
}

export const recurringTransactionFrequencyValues = [
  RecurringTransactionFrequency.DAILY,
  RecurringTransactionFrequency.WEEKLY,
  RecurringTransactionFrequency.MONTHLY,
  RecurringTransactionFrequency.YEARLY
];

export const isRecurringTransactionFrequency = (value: unknown): value is RecurringTransactionFrequency => {
  return typeof value === "string" &&
    recurringTransactionFrequencyValues.includes(value as RecurringTransactionFrequency);
};

export const isValidDate = (value: string | number | Date): boolean => {
  return isNaN(new Date(value).valueOf());
};
