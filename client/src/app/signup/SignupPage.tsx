"use client";

import React, { useState } from "react";
import { Typography } from "@mui/material";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postSignupInfo } from "../api/uploadSignupInfo";
import SnackbarResponse from "../components/snackbar";
import SignupForm from "../components/Forms/SignupForm";
import Logo from "../components/logo";

function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be between 2 and 50 characters")
      .max(50, "Name must be between 2 and 50 characters")
      .required("Name Required"),
    email: Yup.string().email("Invalid email").required("Email Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsLoading(true);
      try {
        await postSignupInfo(values.name, values.email);
        setOpen(true);
        setMessage("Sign Up Successful!");
        resetForm();
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
    <main className="flex flex-col min-h-screen bg-ingquiro-beige mb-52">
      <Logo />
      <SnackbarResponse open={open} setOpen={setOpen} message={message} />
      <div className="flex w-full">
        <div className="div1 flex-1 flex flex-col">
          <div className="md:pl-36 px-8 flex flex-col gap-y-7">
            <div>
              <Typography
                className={`font-normal leading-[58px] md:text-left text-center`}
                style={{ fontSize: 58, fontFamily: "Bagnard" }}
              >
                {`Your home base for investment research.`}
              </Typography>
            </div>
            <div>
              <Typography
                className="font-DM text-[#757575] leading-8 md:text-left text-center"
                style={{ fontSize: 24 }}
              >
                A simplified way to screen and retrieve information about your
                investable universe. We’re looking to launch to the world this
                winter.
                <br />
                <br />
                Meanwhile, we’re still building out our core features. Want to
                help us get ready for our launch? Sign up for our private beta
                and we’ll email you with instructions in the coming weeks.
              </Typography>
            </div>
            <SignupForm formik={formik} isLoading={isLoading} />
          </div>
        </div>
        <div className="div2 flex-1 md:flex justify-center items-center hidden">
          <Image src={"/signup-img.svg"} height={1} width={635} alt="" />
        </div>
      </div>
    </main>
  );
}

export default SignupPage;
