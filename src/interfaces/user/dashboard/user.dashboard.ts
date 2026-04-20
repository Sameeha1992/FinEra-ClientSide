export interface DashboardSummary {
  totalLoans: number;
  activeLoans: number;
  totalRemainingDues: number;
  rejectedApplications: number;
}
export interface ActiveLoanCard {
  loanId: string;
  bankName: string;
  loanType: string;
  loanAmount: number;
  remainingDueAmount: number;
  nextEmiAmount: number | null;
  nextEmiDate: string | null;
  completionPercentage: number;
  expectedDueDate: string | null;
}
export interface RejectedApplication {
  applicationId: string;
  bankName: string;
  loanType: string;
  requestedAmount: number;
  rejectionReason: string;
  status: string;
}
export interface UserDashboardData {
  summary: DashboardSummary;
  activeLoanCards: ActiveLoanCard[];
  rejectedApplications: RejectedApplication[];
}
export interface DashboardApiResponse {
  success: boolean;
  message: string;
  data: UserDashboardData;
}