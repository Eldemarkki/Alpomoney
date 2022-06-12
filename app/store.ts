import { configureStore } from '@reduxjs/toolkit'
import sinksReducer from '../features/sinksSlice'
import storagesReducer from '../features/storagesSlice';

export const store = configureStore({
  reducer: {
    sinks: sinksReducer,
    storages: storagesReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch