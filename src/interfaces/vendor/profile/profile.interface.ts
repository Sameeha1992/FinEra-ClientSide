export interface CompleteVendorProfileForm{
    licence_number:string,
    licenceDoc:File,
    registrationDoc:File
}


export interface VendorCompleteProfileData{
    name?:string,
    email?:string,
    vendorId?:string,
    registrationNumber?:string,
    licenceNumber?:string
    
    documents?:{
      registrationDocUrl?:string,
      licenceDocUrl?:string
    }
}