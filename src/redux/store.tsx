import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/auth.slice";

import {persistStore,persistReducer} from "redux-persist"
import storage from "redux-persist/lib/storage"



const persistConfig ={
    key:"auth",
    storage,
}

const persistAuthReducer = persistReducer(persistConfig,authReducer)
export const store = configureStore({
    reducer:{
        auth:persistAuthReducer,
    },
})

export const persistor = persistStore(store)


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch