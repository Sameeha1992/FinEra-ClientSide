import type { Gender } from "@/components/user/userDashboard/ProfileCompletionForm";

export interface CompleteProfileForm {
  fullName: string;
  email:string
  phone: string;
  dob?: string;
  job?: string;
  income?: string;
  gender?:Gender;
  adhaarNumber?: string;
  panNumber?: string;
  cibilScore?: string;
  adhaarDoc?: File;
  panDoc?: File;
  cibilDoc?: File;
  profileImage?: File;
}

export interface  CompleteProfileData {
  fullName?:string;
  email?:string
  phone?: string;
  status: "VERIFIED" | "NOT_VERIFIED";
  dob?: string;
  job?: string;
  income?: string;
  customerId?:string
  gender?: "male" | "female" | "other";
  adhaarNumber?: string;
  panNumber?: string;
  cibilScore?: string;
  documents?: {
    adhaarDocUrl: string;
    panDocUrl: string;
  };
}





export interface UserProfileDisplayProps {
  personalInfo?: {
    fullName?: string;
    dateOfBirth?: string;
    email?: string;
    gender?: string;
    phone?: string;
    customerId?: string;
  };
  financialInfo?: {
    occupation?: string;
    cibilScore?: string;
    annualIncome?: string;
  };
  documentInfo?: {
    aadharNumber?: string;
    aadharDocument?: string;
    panNumber?: string;
    panDocument?: string;
    cibilScore?: string;
    cibilDocument?: string;
  };
  onEditDetails?: () => void;
  onChangePassword?: () => void;
}
