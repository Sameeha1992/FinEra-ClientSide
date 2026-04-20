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


//User Transaction Report downlaod vendor side:-


export interface VendorReportFilters {
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  userId?: string;
  loanType?: string;
  transactionId?: string;
}

export interface VendorDashboardExportDto {
  transactionId: string;
  userName: string;
  userEmail: string;
  loanType: string;
  productName: string;
  interestRate: number;
  emiNumber: number;
  emiAmount: number;
  penaltyPaid: number;
  totalPaid: number;
  paidAt: string;
}

