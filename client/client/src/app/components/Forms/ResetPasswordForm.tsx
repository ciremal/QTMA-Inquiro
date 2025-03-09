import { TextField } from "@mui/material";
import LoadingButton from "../LoadingButton";

type ResetPasswordForm = {
  formik: any;
  isLoading: boolean;
};

const ResetPasswordForm = ({ formik, isLoading }: ResetPasswordForm) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-5 md:items-start items-center">
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

        <TextField
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          variant="standard"
          className="w-full"
          placeholder="Confirm Password"
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
              ? formik.errors.confirmPassword
              : "Confirm Password"
          }
          sx={{
            ".MuiInputBase-input": { fontSize: "1.25rem" },
          }}
          slotProps={{
            formHelperText: {
              sx: {
                color:
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "red"
                    : "black",
              },
            },
          }}
        />
      </div>
      <div className="flex md:justify-start justify-center">
        <LoadingButton message="Reset Password" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default ResetPasswordForm;
