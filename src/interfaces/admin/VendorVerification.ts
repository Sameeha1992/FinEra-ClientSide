export interface VendorVerification {
  vendorId: string;
  vendorName: string;
  email: string;
  status: "verified" | "not verified";
}

export interface VendorVerificationQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface VendorVerificationResponse {
  vendors: VendorVerification[];
  total: number;
  currentPages: number;
  totalPages: number;
}

export interface VendorDetailData {
  vendorId: string;
  vendorName: string;
  email: string;
  registrationNumber: string;
  licenceNumber?: string;
  registrationDoc?: string;
  licenceDoc?: string;
  status: "verified" | "notVerified" | "rejected";
  isProfileComplete: boolean;
  accountStatus: "blocked" | "unblocked";
  role: "vendor" | "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  uploadedAt?: Date;
}

export type VendorStatus = "verified" | "notVerified" | "rejected";

export interface UpdateVendorStatusPayload {
    vendorId:string,
    status:VendorStatus
    rejectionReason?:string
}