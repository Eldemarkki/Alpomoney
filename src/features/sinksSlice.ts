import { Sink } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SinksState {
  sinks: Sink[]
}

const initialState: SinksState = {
  sinks: []
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
    }
  }
});

export const { setSinks, addSink, removeSink } = sinksSlice.actions;
export default sinksSlice.reducer;
