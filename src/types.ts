import { Brand, WithIds } from "./utils/types";

export type UserId = Brand<string, "UserId">;
export type User = {
  id: UserId,
  username: string
};

export type SinkId = Brand<string, "SinkId">;
export type Sink = WithIds<{
  name: string
}, SinkId>;

export type StorageId = Brand<string, "StorageId">;
export type Storage = WithIds<{
  name: string,
  initialBalance: number
}, StorageId>;

export type TransactionId = Brand<string, "TransactionId">;
export type Transaction = WithIds<{
  amount: number,
  description: string,
  sinkId: SinkId,
  storageId: StorageId,
  createdAt: Date,
  category: string
}, TransactionId>;

export type RecurringTransactionId = Brand<string, "RecurringTransactionId">;
export enum RecurringTransactionFrequency {
  daily = "daily",
  weekly = "weekly",
  monthly = "monthly",
  yearly = "yearly"
}
export type RecurringTransaction = WithIds<{
  name: string,
  amount: number,
  sinkId: SinkId,
  storageId: StorageId,
  frequency: RecurringTransactionFrequency,
  startDate: Date,
  category: string
}, RecurringTransactionId>;
