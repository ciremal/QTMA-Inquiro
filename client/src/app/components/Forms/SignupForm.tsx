import { inter } from "@/app/ui/fonts";
import { LoadingButton } from "@mui/lab";
import { CircularProgress, TextField, Typography } from "@mui/material";

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
          sx={{
            width: "25%",
            borderRadius: 0,
            borderStyle: "solid",
            borderWidth: 1,
            borderColor: "black",
            color: "black",
            textTransform: "none",
            paddingLeft: "8rem",
            paddingRight: "8rem",
            paddingTop: "0.75rem",
            paddingBottom: "0.75rem",
            "&:hover": {
              backgroundColor: "black",
              color: "white",
            },
            transition: "all 0.3s ease",
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
