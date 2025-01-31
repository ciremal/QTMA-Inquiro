import { inter } from "@/app/ui/fonts";
import { TextField, Typography } from "@mui/material";
import Link from "next/link";
import LoadingButton from "../LoadingButton";

type LoginFormProps = {
  formik: any;
  isLoading: boolean;
  incorrectCred: boolean;
};

const LoginForm = ({ formik, isLoading, incorrectCred }: LoginFormProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-5 md:items-start items-center">
        <TextField
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          variant="standard"
          className="w-full"
          placeholder="email@domain.com"
          helperText={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : "Email"
          }
          sx={{
            ".MuiInputBase-input": { fontSize: "1.25rem" },
          }}
          slotProps={{
            formHelperText: {
              sx: {
                color:
                  formik.touched.email && formik.errors.email ? "red" : "black",
              },
            },
          }}
        />

        <TextField
          id="password"
          name="password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          variant="standard"
          className="w-full"
          placeholder="Password"
          helperText={
            formik.touched.password && formik.errors.password
              ? formik.errors.password
              : "Password"
          }
          sx={{
            ".MuiInputBase-input": { fontSize: "1.25rem" },
          }}
          slotProps={{
            formHelperText: {
              sx: {
                color:
                  formik.touched.password && formik.errors.password
                    ? "red"
                    : "black",
              },
            },
          }}
        />
      </div>
      {incorrectCred && (
        <div
          className={`flex md:justify-start justify-center w-full flex-col bg-red-200 p-7 rounded-md ${inter.className} text-red-800`}
        >
          <div>
            {
              "Your email or password is incorrect, or this account doesn't exist. Please try again."
            }
          </div>
          <br></br>
          <div>
            Forgot your password?{" "}
            <Link href={"/forgot-password"} className="underline">
              Reset your password
            </Link>
          </div>
        </div>
      )}
      <div className="flex md:justify-start justify-center">
        <LoadingButton message="Login" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default LoginForm;
