import { Typography } from "@mui/material";
import { inter } from "../ui/fonts";
import { LoadingButton as MUIButton } from "@mui/lab";

type LoadingButtonProps = {
  message: string;
  isLoading: boolean;
};

const LoadingButton = ({ message, isLoading }: LoadingButtonProps) => {
  return (
    <MUIButton
      type="submit"
      loading={isLoading}
      loadingPosition="end"
      sx={{
        width: "100%",
        borderRadius: 0,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "black",
        color: "black",
        textTransform: "none",
        paddingLeft: "6rem",
        paddingRight: "6rem",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        "&:hover": {
          backgroundColor: "black",
          color: "white",
        },
        transition: "all 0.3s ease",
      }}
    >
      <Typography sx={{ fontSize: 20 }} className={`${inter.className}`}>
        {message}
      </Typography>
    </MUIButton>
  );
};

export default LoadingButton;
