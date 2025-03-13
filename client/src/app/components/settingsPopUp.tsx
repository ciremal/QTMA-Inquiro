"use client";

import { useState } from "react";
import { auth } from "../firebase/config";
import {
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { FiEye, FiEyeOff } from "react-icons/fi";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";

const SettingsPopup = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const user = auth.currentUser;
  const [firstName, setFirstName] = useState(
    user?.displayName?.split(" ")[0] || ""
  );
  const [lastName, setLastName] = useState(
    user?.displayName?.split(" ")[1] || ""
  );
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requiresReauth, setRequiresReauth] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleSave = async () => {
    if (!user) return;

    setError("");
    setSuccess("");

    // Password validation
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*()!])[A-Za-z\d@#$%^&*()!]{8,12}$/;

    if (newPassword && !passwordRegex.test(newPassword)) {
      setError(
        "Password must be 8-12 characters with uppercase, lowercase, number, and special character."
      );
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      // Update display name
      const fullName = `${firstName} ${lastName}`;
      if (fullName !== user.displayName) {
        await updateProfile(user, { displayName: fullName });
      }

      // Update password if changed
      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setSuccess("Profile updated successfully!");
    } catch (err) {
      if ((err as { code: string }).code === "auth/requires-recent-login") {
        setRequiresReauth(true);
      } else {
        setError("Failed to update profile. Please try again.");
        console.error(err);
      }
    }
  };

  const handleReauth = async () => {
    if (!user) return;

    setError("");
    setSuccess("");

    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      setRequiresReauth(false);
      handleSave();
    } catch (err) {
      setError(
        "Re-authentication failed. Please check your current password and try again."
      );
      console.error(err);
    }
  };

  return (
    isOpen && (
      <div className="md:absolute md:right-0 bg-black bg-opacity-50 z-50 font-sans md:mt-8">
        <div className="bg-[rgb(14,14,14)] text-white p-6 rounded-xl border border-gray-600 shadow-lg w-[28rem] max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Account Settings</h2>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={onClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="border p-3 rounded-full border-primaryLightGray">
                <CreateOutlinedIcon
                  fontSize="large"
                  className="text-primaryLightGray"
                />
              </div>
            </div>

            <div>
              {requiresReauth ? (
                <>
                  <label className="text-xs block mb-2 text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  <button
                    className="px-4 py-2 bg-blue-500 rounded-xl text-white mt-4"
                    onClick={handleReauth}
                  >
                    Re-authenticate
                  </button>
                </>
              ) : (
                <>
                  {/* First Name */}
                  <label className="text-xs block mb-2 text-gray-300">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600"
                  />

                  {/* Last Name */}
                  <label className="text-xs block mt-3 mb-2 text-gray-300">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600"
                  />

                  {/* Email Address (Disabled) */}
                  <label className="text-xs block mt-3 mb-2 text-gray-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600 cursor-not-allowed text-gray-400"
                  />

                  {/* Current Password */}
                  <label className="text-xs block mt-3 mb-2 text-gray-300">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {/* New Password */}
                  <label className="text-xs block mt-3 mb-2 text-gray-300">
                    Create New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {/* Password Requirements */}
                  <p
                    className={`text-xs mt-2 ${
                      newPassword.length >= 8
                        ? "text-green-400"
                        : "text-[#868686]"
                    }`}
                  >
                    Minimum length of 8 characters
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      /[A-Z]/.test(newPassword)
                        ? "text-green-400"
                        : "text-[#868686]"
                    }`}
                  >
                    At least one uppercase letter
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      /[a-z]/.test(newPassword)
                        ? "text-green-400"
                        : "text-[#868686]"
                    }`}
                  >
                    At least one lowercase letter
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      /\d/.test(newPassword)
                        ? "text-green-400"
                        : "text-[#868686]"
                    }`}
                  >
                    At least one numeric digit
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      /[@#$%^&*()!]/.test(newPassword)
                        ? "text-green-400"
                        : "text-[#868686]"
                    }`}
                  >
                    At least one special character (e.g., !@#$%^&*)
                  </p>

                  {/* Confirm New Password */}
                  <label className="text-xs block mt-3 mb-2 text-gray-300">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={passwordVisible ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 rounded-xl bg-[rgb(0,0,0)] border border-gray-600 pr-10"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400"
                    >
                      {passwordVisible ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>

                  {error && <p className="text-red-500 mt-2">{error}</p>}
                  {success && <p className="text-green-500 mt-2">{success}</p>}

                  {/* Buttons */}
                  <div className="flex justify-end mt-4">
                    <button
                      className="px-4 py-2 rounded-xl mr-2 text-white underline"
                      onClick={onClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-600 bg-backdrop rounded-xl text-white"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default SettingsPopup;
