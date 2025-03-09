interface CurrentPriceProps {
  price: number;
  previousClose: number;
}

const CurrentPrice = ({ price, previousClose }: CurrentPriceProps) => {
  const diff = price - previousClose;
  const diffPerc = ((diff / previousClose) * 100).toFixed(2);

  return (
    <div className="flex md:justify-start justify-center w-full items-center gap-5">
      <p className="m-0 text-[40px] ml-8 font-[500]">${price}</p>
      <p
        className={`text-[16px] ${
          diff >= 0 ? "text-green-500" : "text-red-600"
        } italic`}
      >
        {`${diff >= 0 ? "+" : ""}${diff.toFixed(2)} (${diffPerc}%) today`}
      </p>
    </div>
  );
};

export default CurrentPrice;
