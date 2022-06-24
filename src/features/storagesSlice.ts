import { Storage } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StoragesState {
  storages: Storage[];
}

const initialState: StoragesState = {
  storages: []
}

export const storagesSlice = createSlice({
  name: "storages",
  initialState,
  reducers: {
    setStorages: (state: StoragesState, action: PayloadAction<Storage[]>) => {
      state.storages = action.payload;
    },
    addStorage: (state: StoragesState, action: PayloadAction<Storage>) => {
      state.storages.push(action.payload);
    },
    removeStorage: (state: StoragesState, action: PayloadAction<string>) => {
      state.storages = state.storages.filter(storage => storage.id !== action.payload);
    }
  }
});

export const { setStorages, addStorage, removeStorage } = storagesSlice.actions;
export default storagesSlice.reducer;