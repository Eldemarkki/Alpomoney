import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConvertDates } from "../utils/types";
import { RecurringTransaction } from "@alpomoney/shared";

export interface RecurringTransactionsState {
  recurringTransactions: ConvertDates<RecurringTransaction>[]
}

export const initialState: RecurringTransactionsState = {
  recurringTransactions: []
};

export const recurringTransactionsSlice = createSlice({
  name: "recurringTransactions",
  initialState,
  reducers: {
    setRecurringTransactions: (
      state: RecurringTransactionsState,
      action: PayloadAction<ConvertDates<RecurringTransaction>[]>) => {
      state.recurringTransactions = action.payload;
    },
    addRecurringTransaction: (
      state: RecurringTransactionsState,
      action: PayloadAction<ConvertDates<RecurringTransaction>>) => {
      state.recurringTransactions.push(action.payload);
    },
    removeRecurringTransaction: (
      state: RecurringTransactionsState,
      action: PayloadAction<string>) => {
      state.recurringTransactions = state.recurringTransactions.filter(t => t.id !== action.payload);
    }
  }
});

export const {
  setRecurringTransactions,
  addRecurringTransaction,
  removeRecurringTransaction
} = recurringTransactionsSlice.actions;
export default recurringTransactionsSlice.reducer;
