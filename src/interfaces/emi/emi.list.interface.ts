export interface EmiListByLoanIdType{
    emiId?:string,
    loan:string,
    emiNumber:number,
    amount:number,
    dueDate:Date,
    status:"PENDING"|"PAID" |"UPCOMING"| "OVERDUE" | "PAYMENT_IN_PROGRESS",
    penalty?:number,
    totalAmount?:number,
    paidAt?:Date,
}