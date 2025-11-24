import type { UserState } from "@/interfaces/shared/auth/userState.interface";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState:UserState={
    name:null,
    email:null,
    role:null,
    isAuthenticated:false
}


export const vendorSlice = createSlice({
    name:"vendorauth",
    initialState,
    reducers:{
        setVendor:(state,action:PayloadAction<UserState>)=>{
            state.name = action.payload.name;
            state.email = action.payload.email;
            state.role = action.payload.role;
            state.Id = action.payload.Id;
            state.isAuthenticated = true

        },
        clearVendorData:(state)=>{
            Object.assign(state,initialState)
        }
    }
})


export const {setVendor,clearVendorData} = vendorSlice.actions;
export default vendorSlice.reducer;