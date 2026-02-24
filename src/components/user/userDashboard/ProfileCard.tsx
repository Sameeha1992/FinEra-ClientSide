// components/ProfileCard.tsx
import type { FC } from "react";

interface ProfileCardProps {
  name: string;
  customerId: string;
  email: string;
  status: "VERIFIED" | "NOT_VERIFIED";
  isProfileComplete:boolean;
  onCompleteProfile?: ()=>void;
}

const ProfileCard: FC<ProfileCardProps> = ({
  name,
  customerId,
  email,
  status,
  isProfileComplete,
  onCompleteProfile
}) => {
  const isVerified = status === "VERIFIED";
  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg overflow-hidden">
      {/* Teal Header */}
      <div className="h-32 bg-teal-600 relative flex items-end justify-center pb-16">
        <div className="absolute -bottom-12 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-100">
          <span className="text-2xl font-bold text-teal-600">
            {name
              ? name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
              : "NA"}
          </span>
        </div>
      </div>

      {/* Profile Info */}
      <div className="pt-20 pb-8 px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">{name}</h2>
        <div className="mt-4 space-y-2">
          <p className="text-gray-600">
            Customer ID:{" "}
            <span className="font-semibold text-teal-600">{customerId}</span>
          </p>
          <p className="text-gray-600">{email}</p>
        </div>

        <div className="flex flex-col items-center gap-4 mt-6">
          {!isProfileComplete && (
            <button onClick={()=>onCompleteProfile?.()}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold py-3 px-8 rounded-lg transition">
              Complete the Profile Upload Documents
            </button>
          )}

          <button
            className={`${
              isVerified
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            } text-white font-semibold py-2 px-6 rounded-lg transition`}
          >
            {isVerified ? "Verified" : "Not Verified"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
