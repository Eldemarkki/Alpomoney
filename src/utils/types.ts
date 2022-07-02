import { RecurringTransactionFrequency, UserId } from "../types";

export type Brand<T, B> = T & { __brand: B };

export type WithoutIds<T> = Omit<T, "id" | "userId">;

export type WithIds<T, ID> = T & {
  id: ID,
  userId: UserId
};

export type ConvertDates<T> = {
  [k in keyof T]: (T[k] extends Date ? number : T[k]);
}

// TODO: Using `Uncapitalize` is a bit of a hack to get around the type system.
// Without it I get the error "Type 'symbol' is not assignable to type 'string | number | bigint | boolean'"
export type TransientProps<Props> = {
  [key in keyof Props as `$${Uncapitalize<string & key>}`]: Props[key]
}

export function hasKey<K extends string>(o: unknown, k: K): o is { [_ in K]: unknown } {
  return o !== null && typeof o === "object" && k in o;
}

export const recurringTransactionFrequencyValues = [
  RecurringTransactionFrequency.daily,
  RecurringTransactionFrequency.weekly,
  RecurringTransactionFrequency.monthly,
  RecurringTransactionFrequency.yearly
];

export const isRecurringTransactionFrequency = (value: unknown): value is RecurringTransactionFrequency => {
  return typeof value === "string" &&
    recurringTransactionFrequencyValues.includes(value as RecurringTransactionFrequency);
};

export const isValidDate = (value: string | number | Date): boolean => {
  return !isNaN(new Date(value).valueOf());
};

export const isNumber = (value: unknown): value is number => {
  return typeof value === "number";
};
