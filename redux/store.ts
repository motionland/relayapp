import { configureStore } from "@reduxjs/toolkit";
import { businessReducer } from "./feature/business";
import { authenticationReducer, loginReducer, registerReducer } from "./feature/authentication";
import { notificationReducer } from "./feature/notification";
import { emailTempleteReducer } from "./feature/emailTemplete";

export const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    login: loginReducer,
    register: registerReducer,
    business: businessReducer,
    notification: notificationReducer,
    emailTemplete: emailTempleteReducer 
  },
  // middleware: (getDefault) => getDefault(), // default fine
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
