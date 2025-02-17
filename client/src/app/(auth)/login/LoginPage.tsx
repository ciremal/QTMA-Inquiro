"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "@/app/components/snackbar";
import LoginForm from "@/app/components/Forms/LoginForm";
import Link from "next/link";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { useRouter } from "next/navigation";
import SideImage from "../components/SideImage";

import { AiOutlineMail, AiOutlineLock, AiFillAlert, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [incorrectCred, setIncorrectCred] = useState(false);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email Required"),
    password: Yup.string().required("Password Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await signInWithEmailAndPassword(
          values.email,
          values.password
        );
        if (!res) {
          setIncorrectCred(true);
        } else {
          setIncorrectCred(false);
          const token = await res.user.getIdToken();
          document.cookie = `firebase-auth=${token}; path=/`;
          router.push("/");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occurred during signup. Please try again later.");
        setIncorrectCred(true);
      }
      setIsLoading(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <main className="flex items-center justify-center h-screen bg-backdrop">
      <SnackbarResponse open={open} setOpen={setOpen} message={message} />
      <div className="w-full max-w-md p-8 space-y-6">
        <div className="flex justify-center">
          <img src="/darkLogo.svg" alt="Logo" className="h-32 " />
        </div>
        <div className="flex justify-center space-x-4">
          <Link href="/signup">
            <button className="text-gray-400 hover:text-white font-sans">Sign up</button>
          </Link>
          <Link href="/login">
            <button className="text-white border-b-2 border-white font-sans">Log in</button>
          </Link>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
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
              onChange={formik.handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3.5 text-gray-400"
            >
              {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible /> }
            </button>
            {incorrectCred && (
              <div className="flex space-x-1 items-center mt-2 ">
                <AiFillAlert className="text-red-500" size={20} />
                <p className="text-red-500 text-xs font-sans">
                  Invalid email or password. Please try again.
                </p>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 text-white rounded-md hover:opacity-90 font-sans bg-backdrop border border-gray-600 brightness-100"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
