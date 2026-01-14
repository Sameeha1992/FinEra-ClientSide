export const AuthRoutes={

    //User Side:
    LOGIN:'/user/login',
    REGISTER:'/user/register',
    GENERATE_OTP:"/user/generate-otp",
    VERIFY_OTP:"/user/verify-otp",
    FORGET_PASSWORD:"/user/forget-password",
    VERIFY_FORGET_PASSWORD:"/user/verify-forget-otp",
    RESET_PASSWORD:"/user/reset-password",
    GOOGLE_AUTH:"/user/auth/google",

    //Vendor Side:
    VENDOR_REGISTER:"/vendor/vendor-register",
    VENDOR_LOGIN:'/vendor/login',
    VENDOR_GENERATE_OTP:"/vendor/generate-otp",
    VENDOR_VERIFY_OTP:"/vendor/verify-otp",
    VENDOR_FORGET_PASSWORD:"/vendor/forget-password",
    VENDOR_VERIFY_FORGET_PASSWORD:"/vendor/verify-forget-otp",
    VENDOR_RESET_PASSWORD:"/vendor/reset-password",
    VENDOR_GOOGLE_AUTH:"/vendor/auth/google",


    //Admin:
    ADMIN_LOGIN:"/admin/login"


        
}