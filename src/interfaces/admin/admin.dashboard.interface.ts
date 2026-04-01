// types/admin/dashboard.types.ts

export interface VendorStatusOverview {
  approved: number;
  pending: number;
  rejected: number;
}

export interface AdminDashboardSummary {
  totalUsers: number;
  totalVendors: number;
  verifiedVendors: number;
  nonVerifiedVendors: number;
  rejectedVendors: number;
  totalLoanApplications: number;
  approvedLoans: number;
  totalRevenue: number;
}

export interface AdminDashboardResponse {
  summary: AdminDashboardSummary;
  vendorStatusOverview: VendorStatusOverview;
}