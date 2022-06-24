import { RecurringTransaction } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConvertDates } from "../utils/types";

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
    }
  }
});

export const { setRecurringTransactions, addRecurringTransaction } = recurringTransactionsSlice.actions;
export default recurringTransactionsSlice.reducer;
