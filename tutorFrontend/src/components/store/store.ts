import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/userSlice"
import courseReducer from "./slice/courseSlice"
import subscriptionReducer from "./slice/paymentSlice"
import adminReducer from "./slice/adminSlice"

const store  = configureStore({
  reducer:{
    auth: authReducer,
    course: courseReducer,
    subscription: subscriptionReducer,
    admin : adminReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;