import { getReports } from "@/app/api/fetchStockInfo";
import { ReportsCard } from "./ReportsCard";

interface ReportsProps {
  cik: string;
}

const Reports = async ({ cik }: ReportsProps) => {
  const reports = await getReports(cik);

  return (
    <div className="bg-white dark:bg-secondaryBlack border-2 border-slate-300 dark:border-primaryGray rounded-md p-8 w-1/3 box-border overflow-x-auto overflow-y-auto no-scrollbar">
      <ReportsCard reports={reports} />
    </div>
  );
};

export default Reports;
