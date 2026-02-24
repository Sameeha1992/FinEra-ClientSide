export interface Account {
  id: string;
  name: string;
  vendorName?: string;      // vendors use vendorName in the backend schema
  email: string;
  registrationNumber?: string;
  phone?: string;
  status: "active" | "blocked";
  role: "user" | "vendor";
}