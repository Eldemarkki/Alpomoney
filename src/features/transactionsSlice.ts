import { Transaction, TransactionId } from "../types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ConvertDates } from "../utils/types";

export interface TransactionsState {
  transactions: ConvertDates<Transaction>[]
}

const initialState: TransactionsState = {
  transactions: []
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    setTransactions: (state: TransactionsState, action: PayloadAction<ConvertDates<Transaction>[]>) => {
      state.transactions = action.payload;
    },
    addTransaction: (state: TransactionsState, action: PayloadAction<ConvertDates<Transaction>>) => {
      state.transactions.push(action.payload);
    },
    removeTransaction: (state: TransactionsState, action: PayloadAction<string>) => {
      state.transactions = state.transactions.filter(transaction => transaction.id !== action.payload);
    },
    editTransaction: (
      state: TransactionsState,
      action: PayloadAction<{ id: TransactionId, data: ConvertDates<Transaction> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.transactions.findIndex(transaction => transaction.id ===
        id);
      if (index !== -1) {
        state.transactions[index] = data;
      }
    }
  }
});

export const {
  setTransactions,
  addTransaction,
  removeTransaction,
  editTransaction
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
