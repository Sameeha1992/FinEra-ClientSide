import axiosInstance from "@/config/axiosInterceptor";
import type { AccountQuery } from "@/interfaces/admin/AccouuntQuery";


export const fetchAccounts = async (query:AccountQuery)=>{
   try{
     const response = await axiosInstance.get("/admin/accounts",{
        params:query
    })
    return response.data
}catch(error:any){
  throw error?.response?.data 
}
}


export const updateAccountStatus = async(accountId:string,status:"active"|"blocked",role:"user"|"vendor")=>{
  const response = await axiosInstance.patch(`/admin/accounts/${accountId}/status`,{status,role})
  return response.data
}