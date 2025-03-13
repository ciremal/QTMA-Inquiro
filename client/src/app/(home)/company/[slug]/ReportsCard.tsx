import { inter, interBold } from "@/app/ui/fonts";
import Link from "next/link";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

export const ReportsCard = ({ reports }: any) => {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full">
        <p className={`text-xl ${interBold.className} mb-3`}>
          Financial Reports
        </p>
      </div>

      {reports.map((item: any, index: number) => {
        return (
          <div
            key={item.date || index}
            className="flex justify-between items-center w-[90%] py-3 border-solid border-primaryGray border-b-[1px] "
          >
            <p className={`text-[15px] ${inter.className}`}>{`${item.date}, ${
              item.form === "10-Q" ? "Quarterly Report" : "Annual Report"
            }`}</p>
            <Link href={item.source} target="_blank">
              <FileDownloadOutlinedIcon sx={{ color: "#108AB2" }} />
            </Link>
          </div>
        );
      })}
    </div>
  );
};
