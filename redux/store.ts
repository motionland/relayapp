import { configureStore } from "@reduxjs/toolkit";
import businessReducer from "./feature/business/businessSlice";

export const store = configureStore({
  reducer: {
    business: businessReducer,
  },
  // middleware: (getDefault) => getDefault(), // default fine
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
