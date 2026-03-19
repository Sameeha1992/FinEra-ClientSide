import axiosInstance from "@/config/axiosInterceptor";
import { API_ENDPOINTS } from "@/constants/api.endpoints";
import type { EmiListByLoanIdType } from "@/interfaces/emi/emi.list.interface";

export const EmiService ={
    async getEmisByLoanId(loanId:string):Promise<EmiListByLoanIdType[]>{
        const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_EMIS_BY_LOAN_ID(loanId));
        console.log("emi data showing",response.data.data)
        return response.data.data;
    },
    async getEmiDetails(emiId:string):Promise<EmiListByLoanIdType>{
        const response = await axiosInstance.get(API_ENDPOINTS.USER.GET_EMI_DETAILS(emiId));
        console.log("response of emi details",response.data.data);
        return response.data.data;
    }
}