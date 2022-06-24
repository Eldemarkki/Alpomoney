import { Transaction } from "@prisma/client";
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
    }
  }
});

export const {
  setTransactions
} = transactionsSlice.actions;
export default transactionsSlice.reducer;
