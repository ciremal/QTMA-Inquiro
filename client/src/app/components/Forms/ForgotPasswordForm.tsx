import { TextField } from "@mui/material";
import LoadingButton from "../LoadingButton";

type ForgotPasswordFormProps = {
  formik: any;
  isLoading: boolean;
};

const ForgotPasswordForm = ({ formik, isLoading }: ForgotPasswordFormProps) => {
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
      </div>

      <div className="flex md:justify-start justify-center">
        <LoadingButton message="Send Resend Link" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
