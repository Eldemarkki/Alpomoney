import { RecurringTransaction } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RecurringTransactionsState {
  recurringTransactions: RecurringTransaction[];
}

export const initialState: RecurringTransactionsState = {
  recurringTransactions: []
}

export const recurringTransactionsSlice = createSlice({
  name: "recurringTransactions",
  initialState,
  reducers: {
    setRecurringTransactions: (state: RecurringTransactionsState, action: PayloadAction<RecurringTransaction[]>) => {
      state.recurringTransactions = action.payload;
    },
    addRecurringTransaction: (state: RecurringTransactionsState, action: PayloadAction<RecurringTransaction>) => {
      state.recurringTransactions.push(action.payload);
    }
  }
});

export const { setRecurringTransactions, addRecurringTransaction } = recurringTransactionsSlice.actions;
export default recurringTransactionsSlice.reducer;