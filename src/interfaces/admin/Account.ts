export interface Account {
  id: string;
  vendorId?:string;
  customerId?:string;
  name: string;
  vendorName?: string;      // vendors use vendorName in the backend schema
  email: string;
  registrationNumber?: string;
  phone?: string;
  accountStatus: "blocked"|"unblocked";
  role: "user" | "vendor";
}