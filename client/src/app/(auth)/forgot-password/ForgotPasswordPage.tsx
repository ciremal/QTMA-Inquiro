"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "@/app/components/snackbar";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import ForgotPasswordForm from "@/app/components/Forms/ForgotPasswordForm";

function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const actionCodeSettings = {
    url: "http://localhost:3000/reset-password",
  };

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
        const res = await sendPasswordResetEmail(
          values.email,
          actionCodeSettings
        );
        if (res) {
          setOpen(true);
          setMessage("Sent email! Make sure to check junk mail.");
        }
      } catch (error) {
        console.error(error);
        setMessage("An error occured. Please try again later.");
      }
      setIsLoading(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <main className="flex flex-col min-h-screen">
      <SnackbarResponse open={open} setOpen={setOpen} message={message} />
      <div className="flex w-full h-screen">
        <div className="div1 flex-1 flex flex-col bg-white">
          <div className="md:pl-36 px-8 flex flex-col gap-y-7">
            <div className="flex flex-col gap-y-4">
              <Typography
                className={`font-normal leading-[58px] md:text-left text-center`}
                style={{ fontSize: 58, fontFamily: "Bagnard" }}
              >
                {`Forgot Password`}
              </Typography>
              <Typography>
                {`Enter the email associated with your Inquiro account to receive a password reset link`}
              </Typography>
            </div>
            <div className="w-[60%] flex flex-col gap-y-12">
              <ForgotPasswordForm formik={formik} isLoading={isLoading} />
              <div className="flex justify-center items-center">
                <Typography>
                  Remember your password?{" "}
                  <Link className="font-bold" href={"/login"}>
                    Login
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="div2 flex-1 flex-col md:flex items-center hidden">
          <Image src={"/signup-img.svg"} height={1} width={635} alt="" />
        </div>
      </div>
    </main>
  );
}

export default ForgotPasswordPage;
