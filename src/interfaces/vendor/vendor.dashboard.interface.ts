export interface DashboardCards {
  pendingApplications: number;
  overdueLoans: number;
  approvedApplications: number;
  totalApplications: number;
  totalActiveLoans: number;
  repaymentsThisMonth: number;
  totalLoanProducts: number;
  outstandingPenalty: number;
  rejectedApplications: number;
}

export interface ApplicationStatusOverview {
  label: string;
  value: number;
}

export interface LoanTypeDistributionItem {
  label: string;
  value: number;
}

export interface MonthlyApplicationTrend {
  month: string;
  approved: number;
  rejected: number;
  pending: number;
}

export interface VendorDashboardData {
  cards: DashboardCards;
  applicationStatusOverview: ApplicationStatusOverview[];
  loanTypeDistribution: LoanTypeDistributionItem[];
  monthlyApplicationTrend: MonthlyApplicationTrend[];
}

export interface VendorDashboardResponse {
  success: boolean;
  message: string;
  data: VendorDashboardData;
}
