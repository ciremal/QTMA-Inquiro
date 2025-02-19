"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "@/app/components/snackbar";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { AiOutlineMail, AiOutlineLock, AiOutlineUser, AiFillAlert, AiOutlineCheckCircle, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [createUserWithEmailAndPassword] = useCreateUserWithEmailAndPassword(auth);
  const [error, setError] = useState(false);
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    digit: false,
    specialChar: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "First name must be between 2 and 50 characters")
      .max(50, "First name must be between 2 and 50 characters")
      .required("First name required"),
    lastName: Yup.string()
      .min(2, "Last name must be between 2 and 50 characters")
      .max(50, "Last name must be between 2 and 50 characters")
      .required("Last name required"),
    email: Yup.string().email("Invalid email").required("Email required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .max(12, "Password must be at most 12 characters")
      .matches(/[A-Z]/, "Must include an uppercase letter")
      .matches(/[a-z]/, "Must include a lowercase letter")
      .matches(/[0-9]/, "Must include a digit")
      .matches(/[!@#$%^&*]/, "Must include a special character")
      .required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await createUserWithEmailAndPassword(values.email, values.password);
        if (res) {
          const user = res.user;
          await updateProfile(user, {
            displayName: `${values.firstName} ${values.lastName}`,
          });
          const token = await user.getIdToken();
          document.cookie = `firebase-auth=${token}; path=/`;
          setOpen(true);
          setMessage("Sign Up Successful!");
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        setError(true);
        setMessage("An error occurred during signup. Please try again later.");
      }
      setIsLoading(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordChecks({
      length: password.length >= 8 && password.length <= 12,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      digit: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    });
    formik.handleChange(e);
  };

  return (
    <main className="flex items-center justify-center h-screen bg-backdrop">
      <SnackbarResponse open={open} setOpen={setOpen} message={message} />
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-center">
          <img src="/darkLogo.svg" alt="Logo" className="h-32" />
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/signup">
            <button className="text-white border-b-2 border-white font-sans">Sign up</button>
          </Link>
          <Link href="/login">
            <button className="text-gray-400 hover:text-white font-sans">Log in</button>
          </Link>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First name"
              className="w-full p-3 pl-10 text-white bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-sm font-sans"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
          </div>
          <div className="relative">
            <AiOutlineUser className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last name"
              className="w-full p-3 pl-10 text-white bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-sm font-sans"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
          </div>
          <div className="relative">
            <AiOutlineMail className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 pl-10 text-white bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-sm font-sans"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full p-3 pl-10 text-white bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-sm font-sans"
              value={formik.values.password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible /> }
            </button>
            <div className="text-xs mt-2 font-sans">
              <div className={`flex items-center ${passwordChecks.length ? "text-green-500" : "text-gray-400"}`}>
                {passwordChecks.length && <AiOutlineCheckCircle className="mr-1" />}Minimum length of 8-12 characters
              </div>
              <div className={`flex items-center ${passwordChecks.uppercase ? "text-green-500" : "text-gray-400"}`}>
                {passwordChecks.uppercase && <AiOutlineCheckCircle className="mr-1" />}At least one uppercase letter
              </div>
              <div className={`flex items-center ${passwordChecks.lowercase ? "text-green-500" : "text-gray-400"}`}>
                {passwordChecks.lowercase && <AiOutlineCheckCircle className="mr-1" />}At least one lowercase letter
              </div>
              <div className={`flex items-center ${passwordChecks.digit ? "text-green-500" : "text-gray-400"}`}>
                {passwordChecks.digit && <AiOutlineCheckCircle className="mr-1" />}At least one numeric digit
              </div>
              <div className={`flex items-center ${passwordChecks.specialChar ? "text-green-500" : "text-gray-400"}`}>
                {passwordChecks.specialChar && <AiOutlineCheckCircle className="mr-1" />}At least one special character (e.g., !@#$%^&*)
              </div>
            </div>
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute left-3 top-3.5 text-gray-400" size={20} />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="w-full p-3 pl-10 text-white bg-transparent border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white text-sm font-sans"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
            />

            {error && (
              <div className="flex space-x-1 items-center mt-2">
                <AiFillAlert className="text-red-500" size={20} />
                <p className="text-red-500 text-xs font-sans">
                  Signup failed. Please check your details and try again.
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 text-white rounded-md hover:opacity-90 font-sans bg-backdrop border border-gray-600 brightness-100"
          >
            {isLoading ? "Signing up..." : "Create an account"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default SignupPage;
