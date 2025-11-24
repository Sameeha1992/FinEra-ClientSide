export interface UserState{
    name?:string| null;
    email:string|null;
    role:"admin"|"user"|"vendor"|null;
    Id?:string|null;
    isAuthenticated:boolean;
}