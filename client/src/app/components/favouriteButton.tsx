"use client";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { useState } from "react";

const FavouriteButton = () => {
  const [favourited, setFavourited] = useState(false);

  return (
    <button className="mr-8" onClick={() => setFavourited(!favourited)}>
      {favourited ? (
        <StarRateRoundedIcon className="w-10 h-10" />
      ) : (
        <StarBorderRoundedIcon className="w-10 h-10" />
      )}
    </button>
  );
};

export default FavouriteButton;
