"use client";

import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { getData, selectImage } from "../lib/carouselHelpers";
import { formatMarketCap } from "../lib/formattingFunctions";
import { useState, useMemo } from "react";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";

interface CarouselProps {
  data: any[];
}

const Carousel = ({ data }: CarouselProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({
      playOnInit: true,
      stopOnInteraction: false,
      stopOnFocusIn: false,
      startDelay: 500,
    }),
  ]);

  const handleLinkClick = (url: string) => {
    setLoading(true);
    router.push(url);
  };

  const slides = useMemo(() => {
    const formattedData = getData(data);
    const top5 = formattedData.slice(0, 10);
    const bottom5 = formattedData.slice(-10).reverse();
    const res: any[] = [];
    for (let i = 0; i < 10; i++) {
      res.push(top5[i], bottom5[i]);
    }
    return res;
  }, [data]);

  return (
    <div className="overflow-hidden m-auto w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex px-2 gap-3">
          {slides.map((item) => (
            <div
              className="text-center rounded-xl cursor-pointer"
              key={item.symbol + "-slider"}
              onClick={() => handleLinkClick(`/company/${item.symbol}`)}
              style={{
                backgroundImage: `url(${item.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                backgroundBlendMode: "darken",
              }}
            >
              <div className="border border-primaryGray h-96 w-72 flex flex-col gap-2 items-center justify-end rounded-xl px-5 py-8">
                <div className="flex w-full justify-between text-primaryWhite">
                  <p className="text-xl font-semibold">{item.symbol}</p>
                  <p className="text-xl font-semibold">${item.currentPrice}</p>
                </div>
                <div
                  className={`flex w-full justify-start text-[1.75rem] gap-2 font-bold ${
                    item.difference < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {`${item.difference >= 0 ? "+" : ""}${item.difference.toFixed(
                    2
                  )}`}
                  <span className="italic">
                    {`(${item.percentage.toFixed(2)}%)`}
                  </span>
                </div>
                <div className="w-full border"></div>
                <div className="w-full flex text-xs justify-between">
                  <div className="text-primaryLightGray">Market Cap</div>
                  <div className="text-primaryWhite">
                    {formatMarketCap(item.marketCap)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <CircularProgress />
        </div>
      )}
    </div>
  );
};

export default Carousel;
