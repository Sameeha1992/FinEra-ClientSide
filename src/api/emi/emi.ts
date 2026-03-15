import axiosInstance from "@/config/axiosInterceptor";
import type { EmiListByLoanIdType } from "@/interfaces/emi/emi.list.interface";

export const EmiService ={
    async getEmisByLoanId(loanId:string):Promise<EmiListByLoanIdType[]>{
        const response = await axiosInstance.get(`/user/loan/${loanId}/emis`);
        console.log("emi data showing",response.data.data)
        return response.data.data;
    }
}