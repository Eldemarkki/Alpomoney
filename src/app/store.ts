import { configureStore } from "@reduxjs/toolkit";
import sinksReducer from "../features/sinksSlice";
import storagesReducer from "../features/storagesSlice";
import recurringTransactionsReducer from "../features/recurringTransactionsSlice";
import transactionsReducer from "../features/transactionsSlice";

export const store = configureStore({
  reducer: {
    sinks: sinksReducer,
    storages: storagesReducer,
    recurringTransactions: recurringTransactionsReducer,
    transactions: transactionsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
