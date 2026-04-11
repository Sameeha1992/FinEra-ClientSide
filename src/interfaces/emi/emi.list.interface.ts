export interface EmiListByLoanIdType{
    emiId?:string,
    loan:string,
    emiNumber:number,
    amount:number,
    dueDate:Date,
    status:"PENDING"|"PAID" |"UPCOMING"| "OVERDUE" | "PAYMENT_IN_PROGRESS",
    penalty?:number,
    totalAmount?:number,
    paidAt?:string,
}

export interface EmiStatisticsDto {
  totalEmiCount: number;
  paidEmiCount: number;
  remainingEmiCount: number;
  totalPaidAmount: number;
  remainingBalanceAmount: number;
  nextEmiDueDate: string | null;
  overdueCount: number;
}

export interface EmiListingPageDto {
  statistics: EmiStatisticsDto;
  emis: EmiListByLoanIdType[];
}