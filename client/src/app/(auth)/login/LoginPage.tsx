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

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);
  const [incorrectCred, setIncorrectCred] = useState(false);
  const router = useRouter();

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
        setMessage("An error occured during signup. Please try again later.");
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
        <div className="div1 flex-1 flex flex-col bg-white dark:bg-background h-max">
          <div className="md:pl-36 px-8 flex flex-col gap-y-7">
            <div>
              <Typography
                className={`font-normal leading-[58px] md:text-left text-center text-black`}
                style={{ fontSize: 58, fontFamily: "Bagnard" }}
              >
                {`Log in to your account`}
              </Typography>
            </div>
            <div className="md:w-[60%] w-full flex flex-col gap-y-12">
              <LoginForm
                formik={formik}
                isLoading={isLoading}
                incorrectCred={incorrectCred}
              />
              <div className="flex justify-center items-center text-black pb-16">
                <Typography>
                  New to inquiro?{" "}
                  <Link className="font-bold" href={"/signup"}>
                    Make an account
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
    </main>
  );
}

export default LoginPage;
