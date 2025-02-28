"use client";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { useState } from "react";

const FavouriteButton = () => {
  const [favourited, setFavourited] = useState(false);

  return (
    <button className="mr-8" onClick={() => setFavourited(!favourited)}>
      {favourited ? (
        <StarRateRoundedIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
      ) : (
        <StarBorderRoundedIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
      )}
    </button>
  );
};

export default FavouriteButton;
