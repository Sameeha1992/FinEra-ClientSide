export interface AuthState{
    name?:string| null;
    email:string|null;
    role:"admin"|"user"|"vendor"|null;
    Id?:string|null;
    isAuthenticated:boolean;
    status:"verified" |"not_verified" |"blocked"|null
}