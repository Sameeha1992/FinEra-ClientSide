'use client';

import React, { useEffect, useState } from 'react';
import UserProfileDisplay from '@/components/user/userDashboard/CompleteProfile';
import { userProfile } from '@/api/user/userProfile';

const CompleteProfilePage = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await userProfile.getCompleteProfile();
        console.log("API response",res)
        setProfile(res);
      } catch (err) {
        console.error('Profile fetch failed', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!profile) return <p className="text-center mt-10">No data found</p>;

  return (
    <UserProfileDisplay
      personalInfo={{
        fullName: profile.name,
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
      onEditDetails={() => console.log('Edit clicked')}
      onChangePassword={() => console.log('Change password')}
    />
  );
};

export default CompleteProfilePage;
