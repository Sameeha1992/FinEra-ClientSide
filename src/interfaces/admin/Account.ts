export interface Account {
  id: string;
  name: string;
  email: string;
  registrationNumber?: string;
  phone?:string,
  status: "active" | "blocked";
  role: "user" | "vendor";
}