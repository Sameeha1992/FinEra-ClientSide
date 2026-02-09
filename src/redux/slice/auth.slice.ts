import type { AuthState } from "@/interfaces/shared/auth/userState.interface"
import {createSlice,type PayloadAction} from "@reduxjs/toolkit"

const initialState:AuthState = {
  name: null,
  email:null,
  role:null,
  Id:null,
  isAuthenticated:false,
  status:null,
  isProfileComplete:false,
  accessToken:null

};



export const authSlice = createSlice({
  name:"auth",
  initialState,
  reducers:{
    setAuth:(state,action:PayloadAction<AuthState>)=>{
      state.name = action.payload.name ?? null;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.Id = action.payload.Id ?? null;
      state.isAuthenticated = true
      state.status = action.payload.status ?? "not_verified"
      
      state.isProfileComplete = action.payload.isProfileComplete ?? false
      
    },

      setProfileComplete: (state, action: PayloadAction<boolean>) => {
      state.isProfileComplete = action.payload;
    },

    clearAuth:(state)=>{
      Object.assign(state,initialState)
    }
  },
})


export const {setAuth,clearAuth,setProfileComplete} = authSlice.actions;
export default authSlice.reducer;