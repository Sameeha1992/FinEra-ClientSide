export interface EmiListByLoanIdType{

    loan:string,
    emiNumber:number,
    amount:number,
    dueDate:Date,
    status:"PENDING"|"PAID",
    penalty?:number,
    paidAt?:Date,
}