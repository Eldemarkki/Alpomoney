import { RecurringTransactionFrequency } from "@prisma/client";
import { isRecurringTransactionFrequency, recurringTransactionFrequencyValues } from "./types";

export type TypeValidator<T> = {
  validate: (value: unknown) => value is T,
  error: (key: string) => string
}

export const numberValidator: TypeValidator<number> = {
  validate: (value: unknown): value is number => typeof value === "number",
  error: (key: string) => `${key} must be a number`
};

export const stringValidator: TypeValidator<string> = {
  validate: (value: unknown): value is string => typeof value === "string",
  error: (key: string) => `${key} must be a string`
};

export const nonEmptyStringValidator: TypeValidator<string> = {
  validate: (value: unknown): value is string => typeof value === "string" && value.length > 0,
  error: (key: string) => `${key} must be a non-empty string`
};

export const uuidValidator: TypeValidator<string> = {
  validate: (value: unknown): value is string => typeof value === "string" &&
    value.length === 36 &&
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/.test(value),
  error: (key: string) => `${key} must be a valid UUID`
};

export const recurringTransactionFrequencyValidator: TypeValidator<RecurringTransactionFrequency> = {
  validate: isRecurringTransactionFrequency,
  error: (key: string) => `${key} must be one of: ${recurringTransactionFrequencyValues.join(", ")}`
};

export const stringOrNumberValidator: TypeValidator<string | number> = {
  validate: (value: unknown): value is string | number => typeof value === "string" || typeof value === "number",
  error: (key: string) => `${key} must be a string or number`
};
