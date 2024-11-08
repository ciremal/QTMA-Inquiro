import { inter } from "@/app/ui/fonts";
import { LoadingButton } from "@mui/lab";
import { styled, TextField, Typography } from "@mui/material";

type SignupFormProps = {
  formik: any;
  isLoading: boolean;
};

const SignupForm = ({ formik, isLoading }: SignupFormProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-5">
        <TextField
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          variant="standard"
          className="w-1/2"
          placeholder="Your Name"
          helperText={
            formik.touched.name && formik.errors.name
              ? formik.errors.name
              : "Name *"
          }
          sx={{
            ".MuiInputBase-input": { fontSize: "1.25rem" },
          }}
          slotProps={{
            formHelperText: {
              sx: {
                color:
                  formik.touched.name && formik.errors.name ? "red" : "black",
              },
            },
          }}
        />

        <TextField
          id="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          variant="standard"
          className="w-1/2"
          placeholder="email@domain.com"
          helperText={
            formik.touched.email && formik.errors.email
              ? formik.errors.email
              : "Email *"
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
      <div>
        <LoadingButton
          type="submit"
          loading={isLoading}
          loadingPosition="end"
          d
          className="w-1/4 rounded-none border-solid border border-black text-black normal-case px-32 py-3"
          sx={{
            "&:hover": {
              backgroundColor: "#000000",
              color: "#FFFFFF",
            },
          }}
        >
          <Typography className={`text-xl ${inter.className}`}>
            {"Submit"}
          </Typography>
        </LoadingButton>
      </div>
    </form>
  );
};

export default SignupForm;
