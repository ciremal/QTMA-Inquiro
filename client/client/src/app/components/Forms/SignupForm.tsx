import { TextField } from "@mui/material";
import LoadingButton from "../LoadingButton";

type SignupFormProps = {
  formik: any;
  isLoading: boolean;
};

const SignupForm = ({ formik, isLoading }: SignupFormProps) => {
  return (
    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-y-10">
      <div className="flex flex-col gap-y-5 md:items-start items-center">
        <div className="flex gap-x-16 justify-between items-center">
          <TextField
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            variant="standard"
            placeholder="First Name"
            helperText={
              formik.touched.firstName && formik.errors.firstName
                ? formik.errors.firstName
                : "First Name"
            }
            sx={{
              ".MuiInputBase-input": { fontSize: "1.25rem" },
            }}
            slotProps={{
              formHelperText: {
                sx: {
                  color:
                    formik.touched.firstName && formik.errors.firstName
                      ? "red"
                      : "black",
                },
              },
            }}
          />

          <TextField
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            variant="standard"
            placeholder="Last Name"
            helperText={
              formik.touched.lastName && formik.errors.lastName
                ? formik.errors.lastName
                : "Last Name"
            }
            sx={{
              ".MuiInputBase-input": { fontSize: "1.25rem" },
            }}
            slotProps={{
              formHelperText: {
                sx: {
                  color:
                    formik.touched.lastName && formik.errors.lastName
                      ? "red"
                      : "black",
                },
              },
            }}
          />
        </div>

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
        <LoadingButton message="Create Account" isLoading={isLoading} />
      </div>
    </form>
  );
};

export default SignupForm;
