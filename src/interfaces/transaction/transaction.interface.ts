export interface UserTransactionDto {
  id: string;
  transactionId: string;
  amount: number;
  paymentStatus: string;
  penaltyAmount: number;
  totalAmount: number;
  paidAt: string;
}

export interface VendorTransactionDto {
  id: string;
  transactionId: string;
  userName: string;
  userEmail?: string;
  amount: number;
  paymentStatus: string;
  penaltyAmount: number;
  totalAmount: number;
  paidAt: string;
}

export interface PaginatedUserTransactionDto {
  transactions: UserTransactionDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedVendorTransactionDto {
  transactions: VendorTransactionDto[];
  total: number;
  currentPage: number;
  totalPages: number;
}