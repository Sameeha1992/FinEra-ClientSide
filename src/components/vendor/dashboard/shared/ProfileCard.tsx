
interface ProfileCardProps {
  bankName?: string;
  vendorId?: string;
  email?: string;
  registrationNumber?: string;
  isVerified?: boolean;
}

export default function ProfileCard({
  bankName = 'Federal Bank',
  vendorId = 'V001',
  email = 'federalbank@gmail.com',
  registrationNumber = 'HB123456',
  isVerified = false,
}: ProfileCardProps) {
  return (
    <div className="w-full max-w-lg mx-4 rounded-2xl overflow-hidden shadow-2xl border border-slate-600 bg-white">
      {/* Header */}
      <div className="bg-teal-600 px-6 py-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center text-teal-600 font-bold text-xl">
          F
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{bankName}</h3>
          <p className="text-sm text-teal-100 mt-1">Vendor ID: {vendorId}</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-10 text-center bg-gray-50">
        <div className="space-y-3 mb-8">
          <p className="text-sm text-slate-700">{email}</p>
          <p className="text-sm text-slate-700">Registration Number: {registrationNumber}</p>
        </div>

        <div className="border-t border-slate-200 my-6" />

        {/* Buttons */}
        <div className="space-y-3">
          <button className="w-full px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg transition-colors">
            Complete Verification Form
          </button>

          {!isVerified && (
            <button className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors">
              Not Verified
            </button>
          )}

          {isVerified && (
            <button className="w-full px-4 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors">
              Verified
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
