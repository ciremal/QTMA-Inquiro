import { getReports } from "@/app/api/fetchStockInfo";
import { ReportsCard } from "./ReportsCard";

interface ReportsProps {
  cik: string;
}

const Reports = async ({ cik }: ReportsProps) => {
  const reports = await getReports(cik);

  return (
    <div className="bg-white border-2 border-slate-300 rounded-md p-8 w-full box-border overflow-x-auto overflow-y-auto no-scrollbar">
      <ReportsCard reports={reports} />
    </div>
  );
};

export default Reports;
