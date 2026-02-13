import axiosInstance from "@/config/axiosInterceptor";
import type { ApiResponsnes } from "@/interfaces/shared/auth/auth.interface";
import type { CompleteVendorProfileForm, VendorCompleteProfileData } from "@/interfaces/vendor/profile/profile.interface";

export interface vendorData{
    vendorId:string,
    name:string,
    registrationNumber:string,
    email:string;
    isVerified:boolean,

    licenceNumber?:string,
    registrationDoc?:string;
    licenceDoc?:string;

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
    },

    async completeVendorProfile(formData:CompleteVendorProfileForm):Promise<ApiResponsnes<vendorData>>{

        try {

            const data = new FormData();

              data.append("licenceNumber",formData.licence_number)
              data.append("registrationDoc",formData.registrationDoc);
              data.append("licenceDoc",formData.licenceDoc);

              const response = await axiosInstance.post("/vendor/vendor-complete-profile",data);

              return response.data
        } catch (error) {
            console.error("Failed to complete vendor profile",error);
            throw error
        }
    },

    async getCompleteVendorProfile():Promise<VendorCompleteProfileData>{
        
        try {
            const response = await axiosInstance.get("/vendor/vendor-complete-profile")
            console.log("Complete profile data get request data",response);
            return response.data.data
            
        } catch (error) {
            console.error("failed to fetch the complete profile");
            throw error
        }
    }
}