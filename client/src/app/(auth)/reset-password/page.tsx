"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "@/app/components/snackbar";
import Link from "next/link";
import { auth } from "@/app/firebase/config";
import { confirmPasswordReset } from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import ResetPasswordForm from "@/app/components/Forms/ResetPasswordForm";
import Navbar from "../components/Navbar";
import SideImage from "../components/SideImage";

function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const serachParams = useSearchParams();
  const oobCode = serachParams.get("oobCode");

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, "Password must be greater than 6 characters")
      .required("Password Required"),
    confirmPassword: Yup.string()
      .required("Please retype your password")
      .oneOf([Yup.ref("password")], "Please make sure your passwords match"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (oobCode) {
          await confirmPasswordReset(auth, oobCode, values.password);
          router.push("/login");
        } else {
          setOpen(true);
          setMessage(
            "Something went wrong. The password reset link may be invalid/expired. Please try again."
          );
        }
      } catch (error) {
        console.error(error);
        setOpen(true);
        setMessage(
          "Something went wrong. The password reset link may be invalid/expired. Please try again."
        );
      }
      setIsLoading(false);
    },
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <main className="flex flex-col min-h-screen">
      <>
        {oobCode ? (
          <>
            <Navbar />
            <SnackbarResponse open={open} setOpen={setOpen} message={message} />
            <div className="flex w-full h-screen">
              <div className="div1 flex-1 flex flex-col bg-white dark:bg-background">
                <div className="md:pl-36 px-8 flex flex-col gap-y-7">
                  <div className="flex flex-col gap-y-4">
                    <Typography
                      className={`font-normal leading-[58px] md:text-left text-center text-black`}
                      style={{ fontSize: 58, fontFamily: "Bagnard" }}
                    >
                      {`Set new password`}
                    </Typography>
                  </div>
                  <div className="w-[60%] flex flex-col gap-y-12 text-black">
                    <ResetPasswordForm formik={formik} isLoading={isLoading} />
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
                <SideImage />
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <Box className="shadow-lg p-11 flex flex-col gap-y-7 dark:border dark:border-white">
              <Typography variant="h5">
                Password Reset Request Expired or Invalid
              </Typography>
              <Typography>
                The password reset link you used has already expired or is
                invalid
              </Typography>
              <div className="flex justify-center">
                <Link href={"/forgot-password"}>
                  <Typography className="underline text-blue-600 dark:text-blue-300">
                    Reset your password
                  </Typography>
                </Link>
              </div>
            </Box>
          </div>
        )}
      </>
    </main>
  );
}

export default ResetPasswordPage;
