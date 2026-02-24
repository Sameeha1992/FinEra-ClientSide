import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';


interface TokenState{
    accessToken:string |null;
}


const initialState:TokenState={
    accessToken:null,
};


const tokenSlice = createSlice({
    name:"token",
    initialState,
    reducers:{
        setAccessToken:(state,action:PayloadAction<string>)=>{
            state.accessToken = action.payload
        },
        removeToken:(state)=>{
            state.accessToken = null
        }
    }
})


export const {setAccessToken,removeToken} = tokenSlice.actions;
export default tokenSlice.reducer