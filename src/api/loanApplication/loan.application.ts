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

    if (data.goldDetails) {
      formData.append("goldDetails", JSON.stringify(data.goldDetails));
    }

    if (data.homeDetails) {
      formData.append("homeDetails", JSON.stringify(data.homeDetails));
    }

    if (data.businessDetails) {
      formData.append("businessDetails", JSON.stringify(data.businessDetails));
    }

    if (data.personalDetails) {
      formData.append("personalDetails", JSON.stringify(data.personalDetails));
    }

    // Append files
    if (files.goldImage) {
      formData.append("goldImage", files.goldImage);
    }

    if (files.propertyDoc) {
      formData.append("propertyDoc", files.propertyDoc);
    }

    if (files.registerationDoc) {
      formData.append("registerationDoc", files.registerationDoc);
    }

    if (files.salarySlipDoc) {
      formData.append("salarySlipDoc", files.salarySlipDoc);
    }

    return axiosInstance.post("/user/create-loan-application", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async reapplyRejectedLoan(
    applicationId: string,
    data: CreateLoanApplicationPayload,
    files: LoanApplicationFiles,
  ) {
    const formData = new FormData();

    // Append same fields as createLoanApplication
    formData.append("loanType", data.loanType);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("employmentType", data.employmentType);
    formData.append("monthlyIncome", data.monthlyIncome.toString());
    formData.append("loanAmount", data.loanAmount.toString());
    formData.append("loanTenure", data.loanTenure.toString());

    if (data.goldDetails)
      formData.append("goldDetails", JSON.stringify(data.goldDetails));
    if (data.homeDetails)
      formData.append("homeDetails", JSON.stringify(data.homeDetails));
    if (data.businessDetails)
      formData.append("businessDetails", JSON.stringify(data.businessDetails));
    if (data.personalDetails)
      formData.append("personalDetails", JSON.stringify(data.personalDetails));

    // Append files
    if (files.goldImage) formData.append("goldImage", files.goldImage);
    if (files.propertyDoc) formData.append("propertyDoc", files.propertyDoc);
    if (files.registerationDoc)
      formData.append("registerationDoc", files.registerationDoc);
    if (files.salarySlipDoc)
      formData.append("salarySlipDoc", files.salarySlipDoc);

    // PUT request to reapply endpoint
    return axiosInstance.put(`/user/loans/${applicationId}/reapply`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
