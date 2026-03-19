export const API_ENDPOINTS = {
  ADMIN: {
    VENDORS: "/admin/vendors",

    VENDOR_DETAILS: (vendorId: string) => `/admin/vendors/${vendorId}`,

    UPDATE_VENDOR_STATUS: (vendorId: string) =>
      `/admin/vendors/${vendorId}/status`,

    ADMIN_PROFILE: "/admin/admin-profile",

    ACCOUNTS: "/admin/accounts",

    UPDATE_ACCOUNT_STATUS: (accountId: string) =>
      `/admin/accounts/${accountId}/accountStatus`,
  },

  //User side:-

  USER: {

    //For emi endpoints:-

    CREATE_EMI_PAYMENT_SESSION: "/user/emis/pay",
    GET_EMIS_BY_LOAN_ID: (loanId: string) => `/user/loan/${loanId}/emis`,

    GET_EMI_DETAILS: (emiId: string) => `/user/emi/${emiId}`,

    //Loan application endpoints:-

    CREATE_LOAN_APPLICATION: "/user/create-loan-application",

  REAPPLY_LOAN_APPLICATION: (applicationId: string) =>
    `/user/loans/${applicationId}/reapply`,

  //USER APPLICATIONS:-

   GET_APPLICATIONS: "/user/applications",
  GET_APPLICATION_DETAILS: (applicationId: string) =>
    `/user/applications/${applicationId}`,

  //GET USER LOANS:-

  GET_LOANS: "/user/loans",


  // USER PROFILE ✅
  GET_USER_PROFILE: "/user/user-profile",

  COMPLETE_USER_PROFILE: "/user/user-complete-profile",

  GET_COMPLETE_PROFILE: "/user/complete-profile",

  UPDATE_USER_PROFILE: "/user/user-profile",


  
  //User notifications:-

  GET_NOTITFICATIONS:"/user/notifications",
  GET_UNREAD_COUNT:"/user/notifications/unread-count",
  MARK_AS_READ_NOTIFICATION:(notificationId:string)=>
    `/user/notifications/${notificationId}/read`,

  MARK_ALL_READ_NOTIFICATION:"/user/notifications/read-all"
  },


  VENDOR:{
    // VENDOR LOANS
  ADD_LOAN: "/vendor/loan-product",
  GET_VENDOR_LOANS: "/vendor/loans",
  GET_VENDOR_LOAN: (loanId: string) =>
    `/vendor/loans/${loanId}`,
  UPDATE_VENDOR_LOAN: (loanId: string) =>
    `/vendor/loans/${loanId}`,}
};
