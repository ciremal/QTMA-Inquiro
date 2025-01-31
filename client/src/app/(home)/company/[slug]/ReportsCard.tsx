import { inter, interBold } from "@/app/ui/fonts";
import Link from "next/link";

export const ReportsCard = ({ reports }: any) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className={`text-[29px] ${interBold.className} mb-3`}>
        Financial Reports
      </p>
      {reports.map((item: any, index: number) => {
        return (
          <div
            key={item.date || index}
            className="flex justify-between items-center w-full py-3 border-t-[1px] border-solid border-black dark:border-primaryWhite last:border-b-[1px]"
          >
            <p className={`text-[15px] ${inter.className}`}>{`${item.date}, ${
              item.form === "10-Q" ? "Quarterly Report" : "Annual Report"
            }`}</p>
            <Link href={item.source} target="_blank">
              <p
                className={`text-[12px] ${inter.className} text-[#108AB2] dark:text-cyan-400`}
              >
                Download
              </p>
            </Link>
          </div>
        );
      })}
    </div>
  );
};
