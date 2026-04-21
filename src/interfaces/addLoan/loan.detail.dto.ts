export interface LoanDetailForUserDto {
  loanId: string;
  vendor: {
    id: string;
    vendorName: string;
  };
  name: string;
  description: string;
  status: string;
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
  eligibility: {
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    minCibilScore?: number;
    
  };
 
}