import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import { getDifferences, selectImage } from "../lib/carouselHelpers";
import { formatMarketCap } from "../lib/formattingFunctions";

interface CarouselProps {
  data: any[];
}

const Carousel = ({ data }: CarouselProps) => {
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    AutoScroll({ playOnInit: true, stopOnInteraction: false, startDelay: 500 }),
  ]);

  const formattedData = getDifferences(data);
  const top5 = formattedData.slice(0, 10);
  const bottom5 = formattedData.slice(-10).reverse();
  const slides: any[] = [];
  for (let i = 0; i < 10; i++) {
    slides.push(top5[i], bottom5[i]);
  }

  return (
    <div className="overflow-hidden m-auto w-full">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex px-2 gap-3">
          {slides.map((item) => (
            <div
              className="text-center rounded-xl"
              key={item.symbol + "-slider"}
              style={{
                backgroundImage: selectImage(item.sector),
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundColor: "rgba(0,0,0,0.6)",
                backgroundBlendMode: "darken",
              }}
            >
              <div className="border border-primaryGray h-96 w-72 flex flex-col gap-2 items-center justify-end rounded-xl px-5 py-8">
                <div className="flex w-full justify-between">
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
                  <div>{formatMarketCap(item.marketCap)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
