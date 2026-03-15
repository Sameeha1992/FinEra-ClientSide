export interface UserApplicationListItem {
  applicationId: string;
  applicationNumber: string;
  loanType: string;
  loanAmount: number;
  status: string;
  appliedDate: string;
  rejectionReason?: string;
  employmentType?: string;
  monthlyIncome?: number;
  phoneNumber?: string;
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


export interface IUserApplicationsListResponse {
  applications: UserApplicationListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UserApplicationDetail {
  applicationId: string;
  loanMongoId?:string;
  applicationNumber: string;
  loanType: string;
  loanAmount: number;
  loanTenure: number;
  monthlyIncome: number;
  employmentType: string;
  phoneNumber: string;
  status: string;
  appliedDate: string;

  vendorId: string;
  loanProductId: string;

  personalDetails?: {
    employerName?: string;
    yearsOfExperience?: number;
    purpose?: string;
    salarySlipUrl?: string;
  };

  goldDetails?: {
    goldWeight?: number;
    goldImageUrl?: string;
  };

  homeDetails?: {
    propertyValue?: number;
    propertyLocation?: string;
    propertyType?: string;
    propertyDocUrl?: string;
  };

  businessDetails?: {
    businessName?: string;
    businessType?: string;
    annualRevenue?: number;
    registrationDocUrl?: string;
  };

  rejectionReason?: string;
}
