"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "@/app/components/snackbar";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { sendPasswordResetEmail } from "firebase/auth";
import { AiOutlineMail } from "react-icons/ai";

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email Required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await sendPasswordResetEmail(auth, values.email);
        setMessage("Password reset email sent. Please check your inbox.");
        setOpen(true);
      } catch (error) {
        console.error(error);
        setMessage("Failed to send password reset email. Please try again.");
        setOpen(true);
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
          <img src="/darkLogo.svg" alt="Logo" className="h-32" />
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
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 mt-4 text-white rounded-md hover:opacity-90 font-sans bg-backdrop border border-gray-600 brightness-100"
          >
            {isLoading ? "Sending..." : "Send Reset Email"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
