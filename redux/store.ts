import { configureStore } from "@reduxjs/toolkit";
import { businessReducer } from "./feature/business";
import { authReducer } from "./feature/auth";
import { authenticationReducer } from "./feature/authentication";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    authentication: authenticationReducer,
    business: businessReducer,
    
  },
  // middleware: (getDefault) => getDefault(), // default fine
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
