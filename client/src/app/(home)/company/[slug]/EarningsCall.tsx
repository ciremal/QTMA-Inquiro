"use client";

import { getEarningsCallTranscript } from "@/app/api/fetchStockInfo";
import { formatTranscript } from "@/app/lib/formattingFunctions";
import { Box } from "@mui/material";
import useSWR, { useSWRConfig } from "swr";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useMemo, useState } from "react";
import TranscriptModal from "@/app/components/TranscriptModal";

interface EarningsCallProps {
  ticker: string;
}

const fetcher = async (
  ticker: string,
  mutate: (key: string, data: any, shouldRevalidate: boolean) => void
) => {
  const data = await getEarningsCallTranscript(ticker);
  mutate(`transcript-${ticker}`, { data }, false);
  return data;
};

const EarningsCall = ({ ticker }: EarningsCallProps) => {
  const { cache, mutate } = useSWRConfig();
  const cacheKey = `transcript-${ticker}`;

  const { data, isValidating, error } = useSWR(
    cacheKey,
    async () => {
      const cachedData = cache.get(cacheKey);
      return cachedData?.data ?? fetcher(ticker, mutate);
    },
    {
      revalidateOnFocus: false,
    }
  );
  const isDataAvailable = cache.get(cacheKey);
  const isLoading = !isDataAvailable || isValidating;

  const [open, setOpen] = useState(false);
  const transcriptData = useMemo(() => {
    if (data) {
      return data.data.transcriptData;
    }
  }, [data]);

  return (
    <Box className="flex w-auto bg-secondaryBlack p-6 border rounded-md border-primaryGray text-white">
      <div className="w-full">
        <div className="font-semibold text-xl">Earnings Call</div>
        {error ? (
          <div>Error Occured</div>
        ) : isLoading ? (
          <div>Loading Data...</div>
        ) : (
          <div className="flex flex-col px-6 pt-6 gap-4">
            {!data ? (
              <div>No earnings call transcript provided for {ticker}</div>
            ) : (
              <div className="flex justify-between">
                <div>{ticker} Earnings Call Transcript</div>
                <button>
                  <VisibilityOutlinedIcon onClick={() => setOpen(true)} />
                </button>
              </div>
            )}

            <div>
              <div className="mb-3 underline">Key Insights</div>
              {transcriptData?.takeaways?.map((item: any) => {
                return (
                  <div
                    key={item.title}
                    className="flex justify-start items-center mb-5 gap-4"
                  >
                    <img
                      src={
                        item.sentiment.toLowerCase() === "positive"
                          ? `/upDark.svg`
                          : item.sentiment.toLowerCase() === "negative"
                          ? "/downDark.svg"
                          : "/neutralDark.svg"
                      }
                      className={"w-10"}
                      alt="up"
                    />
                    <div>
                      <p className="font-semibold">{item.title}:</p>
                      <p className="font-light">{item.point}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      {transcriptData && (
        <TranscriptModal
          transcript={formatTranscript(transcriptData.transcript)}
          open={open}
          setOpen={setOpen}
          ticker={ticker}
        />
      )}
    </Box>
  );
};

export default EarningsCall;
