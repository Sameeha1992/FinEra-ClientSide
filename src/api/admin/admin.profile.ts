import axiosInstance from "@/config/axiosInterceptor";

export interface adminData{
    name:string,
    email:string
}


export const adminProfile={
    async getAdminProfile():Promise<adminData>{
        try {
            const response = await axiosInstance.get("/admin/admin-profile");
            console.log("AdminProfile api response",response.data)
            return response.data.data
        } catch (error) {
            console.error("Failed to fetch admin profile");
            throw error
            
        }
    }
}