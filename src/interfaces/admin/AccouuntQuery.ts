export interface AccountQuery{
    page:number,
    limit:number,
    search?:string,
    role:"user"|"vendor"
}