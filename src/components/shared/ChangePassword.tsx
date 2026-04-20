import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChangePasswordProps } from "@/interfaces/shared/auth/auth.interface";
import toast from "react-hot-toast";

const ChangePassword = ({ onSubmit }: ChangePasswordProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(currentPassword, newPassword);
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update password";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-teal-600 overflow-hidden max-w-md w-full">
      <div className="bg-teal-600 px-6 py-3">
        <h2 className="text-white font-semibold text-lg">Change Password</h2>
      </div>
      <div className="px-8 py-6 space-y-5">
        <div>
          <label className="text-xs font-semibold text-teal-600 uppercase tracking-wide block mb-2">
            Current Password
          </label>
          <div className="relative">
            <Input
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrent ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-teal-600 uppercase tracking-wide block mb-2">
            New Password
          </label>
          <div className="relative">
            <Input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="pr-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNew ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-teal-600 hover:bg-teal-600 text-white rounded-full px-6 w-full mt-2"
        >
          <Lock className="w-4 h-4 mr-2" />
          {loading ? "Updating..." : "Update Password"}
        </Button>
      </div>
    </div>
  );
};
export default ChangePassword;
