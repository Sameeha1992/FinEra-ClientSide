import axiosInstance from "@/config/axiosInterceptor";
import type {
  CreateLoanApplicationPayload,
  LoanApplicationFiles,
} from "@/interfaces/loanApplications/loan.application.interface";

export const LoanApplication = {
  async createLoanApplication(
    data: CreateLoanApplicationPayload,
    files: LoanApplicationFiles,
  ) {
    const formData = new FormData();

    formData.append("userId", data.userId);
    formData.append("vendorId", data.vendorId);
    formData.append("loanProductId", data.loanProductId);
    formData.append("loanType", data.loanType);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("employmentType", data.employmentType);
    formData.append("monthlyIncome", data.monthlyIncome.toString());
    formData.append("loanAmount", data.loanAmount.toString());
    formData.append("loanTenure", data.loanTenure.toString());

    if(data.goldDetails){
        formData.append("goldDetails",JSON.stringify(data.goldDetails))
    }


  if (data.homeDetails) {
    formData.append("homeDetails", JSON.stringify(data.homeDetails));
  }

  if (data.businessDetails) {
    formData.append("businessDetails", JSON.stringify(data.businessDetails));
  }

  // Append files
  if (files.goldImageDoc) {
    formData.append("goldImageDoc", files.goldImageDoc);
  }

  if (files.propertyDoc) {
    formData.append("propertyDoc", files.propertyDoc);
  }

  if (files.registrationDoc) {
    formData.append("registrationDoc", files.registrationDoc);
  }

  if (files.salarySlipDoc) {
    formData.append("salarySlipDoc", files.salarySlipDoc);
  }

  return axiosInstance.post("/user/create-loan-application",formData,{headers:{"Content-Type":"multipart/form-data"}})
  },
};
