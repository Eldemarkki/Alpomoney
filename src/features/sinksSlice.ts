import { Sink } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SinksState {
  sinks: Sink[],
  totalSpendings: Record<string, number>,
  totalSpendingsLast30Days: Record<string, number>
}

const initialState: SinksState = {
  sinks: [],
  totalSpendings: {},
  totalSpendingsLast30Days: {}
};

export const sinksSlice = createSlice({
  name: "sinks",
  initialState,
  reducers: {
    setSinks: (state: SinksState, action: PayloadAction<Sink[]>) => {
      state.sinks = action.payload;
    },
    addSink: (state: SinksState, action: PayloadAction<Sink>) => {
      state.sinks.push(action.payload);
    },
    removeSink: (state: SinksState, action: PayloadAction<string>) => {
      state.sinks = state.sinks.filter(sink => sink.id !== action.payload);
    },
    setTotalSpendings: (state: SinksState, action: PayloadAction<Record<string, number>>) => {
      state.totalSpendings = action.payload;
    },
    setSpendingLast30Days: (state: SinksState, action: PayloadAction<Record<string, number>>) => {
      state.totalSpendingsLast30Days = action.payload;
    }
  }
});

export const {
  setSinks,
  addSink,
  removeSink,
  setTotalSpendings,
  setSpendingLast30Days
} = sinksSlice.actions;
export default sinksSlice.reducer;
