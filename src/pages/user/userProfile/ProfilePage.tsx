// pages/ProfilePage.tsx
import ProfileCard from "@/components/user/userDashboard/ProfileCard";

export default function ProfilePage() {
  const user = {
    name: "Sameeha Ansari",
    customerId: "4v0su0f",
    email: "sameehaansari0ll292@gmail.com",
    status: "Not Verified",
  };

  return (
    <div className="flex justify-center">
      {/* The ProfileCard will be centered in the main content area */}
      <ProfileCard {...user} />
    </div>
  );
}
