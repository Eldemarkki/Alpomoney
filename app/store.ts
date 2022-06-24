import { configureStore } from "@reduxjs/toolkit";
import sinksReducer from "../features/sinksSlice";
import storagesReducer from "../features/storagesSlice";
import recurringTransactionsReducer from "../features/recurringTransactionsSlice";

export const store = configureStore({
  reducer: {
    sinks: sinksReducer,
    storages: storagesReducer,
    recurringTransactions: recurringTransactionsReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
