import type { VendorStatus } from "@/interfaces/admin/VendorVerification";

export interface CompleteVendorProfileForm {
  licence_number: string,
  licenceDoc: File,
  registrationDoc: File
}


export interface VendorCompleteProfileData {
  name?: string,
  email?: string,
  vendorId?: string,
  registrationNumber?: string,
  licenceNumber?: string,
  isProfileComplete?: boolean,
  status?: VendorStatus,
  rejectionReason?: string,

  documents?: {
    registrationDocUrl?: string,
    licenceDocUrl?: string
  }
}

export interface UpdateVendorProfileForm {
  name?: string;
  email?: string;
  registrationNumber?: string;
  licenceNumber?: string;
  licenceDoc?: File;
  registrationDoc?: File;
}