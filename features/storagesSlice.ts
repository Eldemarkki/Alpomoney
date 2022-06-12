import { Storage } from "@prisma/client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type StorageWithSum = Storage & { sum: number };

export interface StoragesState {
  storages: StorageWithSum[];
}

const initialState: StoragesState = {
  storages: []
}

export const storagesSlice = createSlice({
  name: "storages",
  initialState,
  reducers: {
    setStorages: (state: StoragesState, action: PayloadAction<StorageWithSum[]>) => {
      state.storages = action.payload;
    },
    addStorage: (state: StoragesState, action: PayloadAction<StorageWithSum>) => {
      state.storages.push(action.payload);
    },
    removeStorage: (state: StoragesState, action: PayloadAction<string>) => {
      state.storages = state.storages.filter(storage => storage.id !== action.payload);
    }
  }
});

export const { setStorages, addStorage, removeStorage } = storagesSlice.actions;
export default storagesSlice.reducer;