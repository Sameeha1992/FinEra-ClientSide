export interface EmiListByLoanIdType{
    emiId?:string,
    loan:string,
    emiNumber:number,
    amount:number,
    dueDate:Date,
    status:"PENDING"|"PAID" |"UPCOMING"| "OVERDUE",
    penalty?:number,
    paidAt?:Date,
}