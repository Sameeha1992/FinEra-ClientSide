export interface ILoanProductDto {
  name: string;
  loanType: string;
  description: string;
  status: "ACTIVE" | "INACTIVE";


  amount: {
    minimum: number;
    maximum: number;
  };

  tenure: {
    minimum: number;
    maximum: number;
  };

  interestRate: number;
  duePenalty: number;
  processingFee: number;

  features?: string[];
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?: number

  };

}


export interface LoanItems {
  loanId: string;
  name: string;
  loanType: string;
  amount: string;
  tenure: string;
  interestRate: string;
  status: "ACTIVE" | "INACTIVE"
}


export interface LoanListing {
  loans: LoanItems[];
  total: number;
  page: number;
  limit: number
}


export interface UpdateLoanDto {
  loanId: string,
  name?: string;
  loanType?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE";

  amount?: {
    minimum: number;
    maximum: number;
  };

  tenure?: {
    minimum: number;
    maximum: number;
  };

  interestRate?: number;
  duePenalty?: number;
  processingFee?: number;

  features?: string[];
  eligibility?: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?: number;
  };
}
