"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import SnackbarResponse from "../../components/snackbar";
import SignupForm from "../../components/Forms/SignupForm";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/app/firebase/config";
import { updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import SideImage from "../components/SideImage";

function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Name must be between 2 and 50 characters")
      .max(50, "Name must be between 2 and 50 characters")
      .required("Name Required"),
    lastName: Yup.string()
      .min(2, "Name must be between 2 and 50 characters")
      .max(50, "Name must be between 2 and 50 characters")
      .required("Name Required"),
    email: Yup.string().email("Invalid email").required("Email Required"),
    password: Yup.string()
      .min(6, "Password must be greater than 6 characters")
      .required("Password Required"),
    confirmPassword: Yup.string()
      .required("Please retype your password")
      .oneOf([Yup.ref("password")], "Please make sure your passwords match"),
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
        const res = await createUserWithEmailAndPassword(
          values.email,
          values.password
        );
        if (res) {
          const user = res.user;
          await updateProfile(user, {
            displayName: `${values.firstName} ${values.lastName}`,
          });
          sessionStorage.setItem("user", user.uid);
          setOpen(true);
          setMessage("Sign Up Successful!");
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
      {/* <Logo /> */}
      <SnackbarResponse open={open} setOpen={setOpen} message={message} />
      <div className="flex w-full h-screen">
        <div className="div1 flex-1 flex flex-col bg-white dark:bg-background">
          <div className="md:pl-36 px-8 flex flex-col gap-y-7 ">
            <div>
              <Typography
                className={`font-normal leading-[58px] md:text-left text-center text-black`}
                style={{ fontSize: 58, fontFamily: "Bagnard" }}
              >
                {`Create your account`}
              </Typography>
            </div>
            <div className="w-[60%] flex flex-col gap-y-12">
              <SignupForm formik={formik} isLoading={isLoading} />
              <div className="flex justify-center items-center text-black">
                <Typography>
                  Already have an account?{" "}
                  <Link className="font-bold" href={"/login"}>
                    Login
                  </Link>
                </Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="div2 flex-1 md:flex flex-col items-center hidden">
          <SideImage />
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
