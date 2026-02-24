export interface LoanListingItem {
  _id: string;
  name: string;
  interestRate: number;
  processingFee: number;
  amount: {
    minimum: number;
    maximum: number;
  };
  tenure: {
    minimum: number;
    maximum: number;
  };
  eligibility: {
    minSalary?: number;
  };
  vendor: {
    _id: string;
    vendorName: string;
  };
}

export interface LoanListingResponse {
  loans: LoanListingItem[];
  total: number;
  page: number;
  limit: number;
}