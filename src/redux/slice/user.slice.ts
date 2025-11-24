import type { UserState } from "@/interfaces/shared/auth/userState.interface"
import {createSlice,type PayloadAction} from "@reduxjs/toolkit"

const initialState:UserState = {
  name: null,
  email:null,
  role:null,
  Id:null,
  isAuthenticated:false,

};


export const userSlice = createSlice({
  name:"userauth",
  initialState,
  reducers:{
    setUser:(state,action:PayloadAction<UserState>)=>{
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.Id = action.payload.Id;
      state.isAuthenticated = true
    },
    clearUserData:(state)=>{
      Object.assign(state,initialState)
    }
  },
})


export const {setUser,clearUserData} = userSlice.actions;
export default userSlice.reducer;