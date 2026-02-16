export interface ILoanProductDto {
  name: string;               
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

  features?: string[];       
  eligibility?: {            
    minAge?: number;
    maxAge?: number;
    minSalary?: number;
    cibilScore?: number;
  };
}


export interface LoanItems{
  loanId:string;
  name:string;
  amount:string;
  tenure:string;
  interestRate:string;
  status: "ACTIVE" |"INACTIVE"
}


export interface LoanListing{
  loans:LoanItems[];
  total:number;
  page:number;
  limit:number
}