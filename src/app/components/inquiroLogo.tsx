import { Typography } from "@mui/material";
import Image from "next/image";
import { epilogue } from "../ui/fonts";

const Logo = () => {
  return (
    <div
      className="navbar md:mx-[4.5rem] my-16 flex flex-row md:justify-start justify-center items-center gap-x-3"
      style={{ height: "10%" }}
    >
      <Image
        src={"/logo.svg"}
        width={89}
        height={54}
        alt="logo"
        style={{ verticalAlign: "bottom" }}
      />
      <Typography
        className={`font-normal pt-3 ${epilogue.className}`}
        style={{ fontSize: 43.45, lineHeight: 1 }}
      >
        {"inquiro"}
      </Typography>
    </div>
  );
};

export default Logo;
