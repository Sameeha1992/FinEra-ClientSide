export interface VendorUserVerificationItem {
  userId: string;
  customerId:string;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
}

export interface VendorUserVerificationResponse {
  users: VendorUserVerificationItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}