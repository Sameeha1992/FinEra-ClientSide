import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user.slice";
import  vendorReducer  from "./slice/vendor.slice";


export const store = configureStore({
    reducer:{
        user:userReducer,
        vendor:vendorReducer,
    }
})


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch