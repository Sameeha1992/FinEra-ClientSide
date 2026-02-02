import axiosInstance from "@/config/axiosInterceptor";

export interface vendorData{
    vendorId:string,
    name:string,
    registrationNumber:string,
    email:string;
    isVerified:boolean
}

export const vendorProfile ={
    async getVendorProfile():Promise<vendorData>{
        try {
            const response = await axiosInstance.get("/vendor/vendor-profile")
            console.log("Vendor profile api response",response.data)
            return response.data.data
            
        } catch (error) {
            console.error("Failed to fetch the vendor profile")
            throw error
        }
    }
}