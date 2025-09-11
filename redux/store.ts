import { configureStore } from "@reduxjs/toolkit";
import { businessReducer } from "./feature/business";
import { loginReducer, registerReducer } from "./feature/authentication";
import { notificationReducer } from "./feature/notification";
import { emailTempleteReducer } from "./feature/emailTemplete";
import { receivingReducer } from "./feature/receiving";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    business: businessReducer,
    notification: notificationReducer,
    emailTemplete: emailTempleteReducer,
    receiving: receivingReducer,
  },
  // middleware: (getDefault) => getDefault(), // default fine
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
