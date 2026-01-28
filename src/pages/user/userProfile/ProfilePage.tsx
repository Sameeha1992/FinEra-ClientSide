// pages/ProfilePage.tsx
import { userProfile } from "@/api/user/userProfile";
import ProfileCard from "@/components/user/userDashboard/ProfileCard";
import type { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface UserData {
  name: string;
  customerId: string;
  email: string;
  phone?: string;
  status?: string;
}

export default function ProfilePage() {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth.isAuthenticated) {
    return <p className="text-center mt-10">Please login</p>;
  }

  return (
    <div className="flex justify-center mt-10">
      <ProfileCard
        name={auth.name ?? ""}
        customerId={auth.Id ?? ""}
        email={auth.email ?? ""}
        status={auth.status ?? ""}
      />
    </div>
  );
}
