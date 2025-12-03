import type { LoginValue } from "@/validations/shared/validation.helpers";
import type React from "react";

export type UserRole = "user"|"vendor"

interface BasePayload{
    name:string,
    email:string,
    password:string,
    role:UserRole
}

export interface UserRegisterPayload extends BasePayload{
    role:"user",
    phone:string,
    registerNumber?:never;
}

export interface VendorRegisterPayload extends BasePayload{
    role:"vendor";
    registerNumber:string,
    phone?:never
}

export type UserPayload = UserRegisterPayload|VendorRegisterPayload;


// export interface userPayload{
//     name:string,
//     email:string,
//     phone:string,
//     registerNumber:string,
//     password:string
//     role:"user"|"vendor"
// } 

export interface OtpPayload{
    email:string,
    otp:string,
    role:"user"|"vendor"
}


export interface ApiResponse{
    success:boolean,
    message:string,
    email?:string,
    role:"vendor"|"user"
}

export interface FormData{
  fullName:string,
  email:string,
  phone:string,
  password:string,
  confirmPassword:string
}

export interface ILogin{
    email:string,
    password:string
}


export interface LocationState{
      userData:UserPayload
}


export interface LoginFormProps{
    role?:"admin"| "vendor"|"user";
    onSubmit?:(formData:LoginValue)=>Promise<void>
    children?: React.ReactNode;
}