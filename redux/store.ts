import { configureStore } from "@reduxjs/toolkit";
import { businessReducer } from "./feature/business";
import { authenticationReducer } from "./feature/authentication";
import { notificationReducer } from "./feature/notification";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    business: businessReducer,
    notification: notificationReducer,
  },
  // middleware: (getDefault) => getDefault(), // default fine
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
