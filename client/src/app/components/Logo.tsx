import Image from "next/image";
import { epilogue } from "../ui/fonts";
import Link from "next/link";

const Logo = () => {
  return (
    <div className="navbar">
      <Link
        href="/"
        className="px-2 py-2 flex flex-row justify-start items-center gap-x-3"
      >
        <Image
          src={"/darkLogo.svg"}
          width={75}
          height={27}
          alt="logo"
          style={{ verticalAlign: "bottom" }}
        />
        <span
          className={`font-normal ${epilogue.className} mt-1 text-primaryWhite`}
          style={{ fontSize: 35, lineHeight: 1 }}
        >
          {"inquiro"}
        </span>
      </Link>
    </div>
  );
};

export default Logo;
