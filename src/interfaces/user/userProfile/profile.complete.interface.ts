import type { Gender } from "@/components/user/userDashboard/ProfileCompletionForm";

export interface CompleteProfileForm {
  name: string;
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
  name?:string;
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
  isCompleteProfile?:boolean;
  documents?: {
    adhaarDocUrl: string;
    panDocUrl: string;
  };
}





export interface UserProfileDisplayProps {
  personalInfo?: {
    name?: string;
    dateOfBirth?: string;
    email?: string;
    gender?: string;
    phone?: string;
    customerId?: string;
    isCompleteProfile?:boolean
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
