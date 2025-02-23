"use client";

import { getEarningsCallTranscript } from "@/app/api/fetchStockInfo";
import { formatTranscript } from "@/app/lib/formattingFunctions";
import { Box } from "@mui/material";
import useSWR from "swr";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import TranscriptModal from "@/app/components/TranscriptModal";

interface EarningsCallProps {
  ticker: string;
}

const fetcher = async (ticker: string) => {
  const data = await getEarningsCallTranscript(ticker);
  return data;
};

const EarningsCall = ({ ticker }: EarningsCallProps) => {
  const { data, error, isLoading } = useSWR(ticker, () => fetcher(ticker), {
    revalidateOnFocus: false,
  });

  const [open, setOpen] = useState(false);

  return (
    <Box className="flex w-auto dark:bg-secondaryBlack bg-background p-6 border rounded-md border-slate-300 dark:border-primaryGray">
      <div className="w-full">
        <div className="font-semibold text-xl">Earnings Call</div>
        {error ? (
          <div>Error Occured</div>
        ) : isLoading ? (
          <div>Loading Data...</div>
        ) : (
          <div className="flex flex-col px-6 pt-6 gap-4">
            {!data?.transcriptData ? (
              <div>No earnings call transcript provided for {ticker}</div>
            ) : (
              <div className="flex justify-between">
                <div>{ticker} Earnings Call Transcript</div>
                <button>
                  <VisibilityOutlinedIcon onClick={() => setOpen(true)} />
                </button>
              </div>
            )}

            {/* <div>
              <div className="mb-1">Key Insights</div>
              {data?.transcriptTakeaways?.takeaways?.map((item: any) => {
                return (
                  <div
                    key={item.title}
                    className="flex justify-center items-center mb-5"
                  >
                    <img src={`/upDark.svg`} alt="up" />
                    <div>
                      <p className="font-semibold">{item.title}:</p>
                      <p className="font-light">{item.point}</p>
                    </div>
                  </div>
                );
              })}
            </div> */}
          </div>
        )}
      </div>
      {data?.transcriptData && (
        <TranscriptModal
          transcript={formatTranscript(data?.transcriptData.transcript)}
          open={open}
          setOpen={setOpen}
          ticker={ticker}
        />
      )}
    </Box>
  );
};

export default EarningsCall;
