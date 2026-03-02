export interface CreateLoanApplicationPayload {
  userId: string;
  vendorId: string;
  loanProductId: string;

  loanType: "PERSONAL" | "GOLD" | "HOME" | "BUSINESS";

  phoneNumber: string;
  employmentType: string;
  monthlyIncome: number;
  loanAmount: number;
  loanTenure: number;

  personalDetails?: {
    employerName?: string;
    yearsOfExperience?: number;
    purpose?: string;
  };

  goldDetails?: {
    goldWeight?: number;
  };

  homeDetails?: {
    propertyValue?: number;
    propertyLocation?: string;
    propertyType?: string;
  };

  businessDetails?: {
    businessName?: string;
    businessType?: string;
    annualRevenue?: number;
  };
}



export interface LoanApplicationFiles {
  goldImage?: File;
  propertyDoc?: File;
  registerationDoc?: File;
  salarySlipDoc?: File;

}                         
