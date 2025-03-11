"use client";

import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import StarRateRoundedIcon from "@mui/icons-material/StarRateRounded";
import { MouseEventHandler, useState } from "react";
import { useUser } from "../(home)/useUserData";

const FavouriteButton = ({
  initialState,
  company,
}: {
  initialState: boolean;
  company: string;
}) => {
  const { userData, setUserDataAndSync } = useUser();
  const [favourited, setFavourited] = useState<boolean>(initialState);

  if (userData) {
    const isFavourited = userData.favourites.includes(company);
    if (isFavourited !== favourited) {
      setFavourited(isFavourited);
    }
  }

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.stopPropagation();
    if (!userData) return;
    if (favourited) {
      await setUserDataAndSync({
        ...userData,
        favourites: userData.favourites.filter((item) => item !== company),
      });
      setFavourited(false);
    }
    if (!favourited) {
      await setUserDataAndSync({
        ...userData,
        favourites: [...userData.favourites, company],
      });
      setFavourited(true);
    }
  };

  return (
    <button className="mr-8" onClick={handleOnClick}>
      {favourited ? (
        <StarRateRoundedIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
      ) : (
        <StarBorderRoundedIcon sx={{ width: "2.5rem", height: "2.5rem" }} />
      )}
    </button>
  );
};

export default FavouriteButton;
