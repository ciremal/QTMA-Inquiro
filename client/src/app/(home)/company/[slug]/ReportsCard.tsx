"use client";

import { inter, interBold } from "@/app/ui/fonts";
import { getReports, Report } from "@/app/api/fetchStockInfo";
import Link from "next/link";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import useSWR from "swr";

export const ReportsCard = ({ cik }: { cik: string }) => {
  const {
    data: reports,
    error,
    isLoading,
  } = useSWR(
    `https://h5o5bfmm0c.execute-api.us-east-2.amazonaws.com/dev/get-reports?cik=${cik}`,
    () => getReports(cik)
  );

  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <p className={`text-xl ${interBold.className} mb-3`}>
          Financial Reports
        </p>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">Error fetching reports</div>}
      {reports && (
        <>
          {reports.map((item: any, index: number) => {
            return (
              <div
                key={item.date || index}
                className="flex justify-between items-center w-[90%] py-3 border-solid border-black dark:border-primaryGray border-b-[1px] "
              >
                <p className={`text-[15px] ${inter.className}`}>{`${
                  item.date
                }, ${
                  item.form === "10-Q" ? "Quarterly Report" : "Annual Report"
                }`}</p>
                <Link href={item.source} target="_blank">
                  <FileDownloadOutlinedIcon sx={{ color: "#108AB2" }} />
                </Link>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};
