import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Storage } from "@alpomoney/shared";

export interface StoragesState {
  storages: Storage[],
  storageBalances: { [key: string]: number }
}

const initialState: StoragesState = {
  storages: [],
  storageBalances: {}
};

export const storagesSlice = createSlice({
  name: "storages",
  initialState,
  reducers: {
    setStorages: (state: StoragesState, action: PayloadAction<Storage[]>) => {
      state.storages = action.payload;
    },
    addStorage: (state: StoragesState, action: PayloadAction<Storage>) => {
      console.log(action);
      state.storages.push(action.payload);
    },
    removeStorage: (state: StoragesState, action: PayloadAction<string>) => {
      state.storages = state.storages.filter(storage => storage.id !== action.payload);
    },
    setStorageBalances: (state: StoragesState, action: PayloadAction<{ [key: string]: number }>) => {
      state.storageBalances = action.payload;
    }
  }
});

export const {
  setStorages,
  addStorage,
  removeStorage,
  setStorageBalances
} = storagesSlice.actions;
export default storagesSlice.reducer;
