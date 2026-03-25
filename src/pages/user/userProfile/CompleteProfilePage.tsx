
import React, { useEffect, useState } from 'react';
import UserProfileDisplay from '@/components/user/userDashboard/CompleteProfile';
import { userProfile } from '@/api/user/userProfile';
import { useNavigate } from 'react-router-dom';
import type{ UseDispatch } from 'react-redux';
import type { AppDispatch } from "@/redux/store";
import { setProfileComplete } from "@/redux/slice/auth.slice";
import { useDispatch } from 'react-redux';


const CompleteProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
 const navigate = useNavigate()
 const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userProfile.getCompleteProfile();
        console.log("API response",res)
        setProfile(res);

        dispatch(setProfileComplete(res.isProfileComplete ?? false))
      } catch (err) {
        console.error('Profile fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">No data found</p>;

  return (
    <UserProfileDisplay
      personalInfo={{
        name: profile.name,
        dateOfBirth: profile.dob,
        email: profile.email,
        gender: profile.gender,
        phone: profile.phone,
        customerId: profile.customerId,
      }}
      financialInfo={{
        occupation: profile.job,
        cibilScore: profile.cibilScore,
        annualIncome: profile.income,
      }}
      documentInfo={{
        aadharNumber: profile.adhaarNumber,
        aadharDocument: profile.documents.adhaarDocUrl,
        panNumber: profile.panNumber,
        panDocument: profile.documents.panDocUrl,
      }}
      onEditDetails={() => navigate("/user/update-profile")}
      onChangePassword={() => navigate("/user/change-password")}
    />
  );
};

export default CompleteProfilePage;
