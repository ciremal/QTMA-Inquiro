import Image from "next/image";
import { epilogue } from "@/app/ui/fonts";

const Logo = () => {
  return (
    <div className="navbar">
      <div className="px-2 py-2 flex flex-row justify-start items-baseline gap-x-3">
        <Image
          src={"/logo.svg"}
          width={65}
          height={27}
          alt="logo"
          style={{ verticalAlign: "bottom" }}
        />
        <span
          className={`font-normal ${epilogue.className} text-black`}
          style={{ fontSize: 35, lineHeight: 1 }}
        >
          {"inquiro"}
        </span>
      </div>
    </div>
  );
};

export default Logo;
