import { auth } from "@/app/firebase/config";
import { letterColorMap } from "@/app/lib/constants";
import {
  formatMarketCap,
  formatPrice,
  calculatePriceDifference,
} from "@/app/lib/formattingFunctions";
import getIndustryColor from "@/app/lib/industryColors";
import {
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useAuthState } from "react-firebase-hooks/auth";
import FavouriteButton from "../favouriteButton";

type TableCompaniesProps = {
  columns: any[];
  orderBy: string;
  order: string;
  handleSort: (property: any) => void;
  paginatedData: any[];
  isPending: boolean;
  startTransition: any;
  router: AppRouterInstance;
};

const TableCompanies = ({
  columns,
  orderBy,
  order,
  handleSort,
  paginatedData,
  isPending,
  startTransition,
  router,
}: TableCompaniesProps) => {
  const [user] = useAuthState(auth);

  return (
    <div className="bg-[rgba(31,31,31,0.4)] p-6 rounded-2xl border border-primaryGray">
      <TableContainer
        component={Paper}
        sx={{
          color: "white",
          borderRadius: "14px",
          boxShadow: "none", // Remove default Paper shadow
          backgroundColor: "transparent", // Make Paper background transparent
          "& .MuiTableRow-root:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      >
        <Table aria-label="stock information table">
          <TableHead>
            <TableRow
              sx={{
                "& th": {
                  borderBottom: "2px solid #3e3e3e",
                  fontWeight: 800,
                },
              }}
            >
              {columns.map((column, index) => (
                <TableCell
                  key={column.id}
                  sx={{
                    textAlign: index === 0 ? "left" : "center", // Left-align first column, center-align others
                    borderBottom: "2px solid #262626", // Set bottom border color
                  }}
                  sortDirection={
                    orderBy === column.id &&
                    (order === "asc" || order === "desc")
                      ? order
                      : undefined
                  }
                >
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={
                      orderBy === column.id &&
                      (order === "asc" || order === "desc")
                        ? order
                        : "asc"
                    }
                    onClick={() => handleSort(column.id)}
                    sx={{
                      color: "white",
                      justifyContent: index === 0 ? "flex-start" : "center",
                      "&.Mui-active": {
                        color: "var(--primaryWhite)",
                      },
                      "&.Mui-active .MuiTableSortLabel-icon": {
                        color: "var(--primaryWhite)",
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow
                key={item.symbol || index}
                hover
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: isPending ? "wait" : "pointer",
                  "&:active": {
                    opacity: 0.7,
                    transform: "scale(0.98)",
                    transition: "transform 0.1s ease-in-out",
                  },
                  "&:hover": {
                    opacity: 0.7,
                    transition: "transform 0.1s ease-in-out",
                  },
                }}
                onClick={() =>
                  startTransition(() => {
                    if (!isPending) {
                      router.push(`/company/${item.symbol}`);
                    }
                  })
                }
              >
                <TableCell
                  component="th"
                  scope="row"
                  sx={{
                    textAlign: "left",
                    fontWeight: 600,
                    borderBottom: "2px solid #262626",
                  }} // Set bottom border color
                >
                  <Box className="flex items-center gap-2 text-primaryWhite font-[500]">
                    <img
                      src={`https://assets.parqet.com/logos/symbol/${item.symbol.toUpperCase()}?format=svg`}
                      alt={`${item.symbol} logo`}
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "20%",
                        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                      }}
                      onError={(e) => {
                        // console.log(item.website);
                        const icon = `https://www.google.com/s2/favicons?domain=${item.website}&sz=256`;
                        const img = new Image();
                        img.src = icon;
                        img.onload = () => {
                          // @ts-ignore
                          e.target.src = icon;
                        };
                        img.onerror = () => {
                          const firstLetter = item.symbol
                            .charAt(0)
                            .toUpperCase();
                          const fallbackColor =
                            (letterColorMap as Record<string, string>)[
                              firstLetter
                            ] || "#000000";
                          const svg = `
                          <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="${fallbackColor}" />
                            <text x="50%" y="50%" dy=".1em" alignment-baseline="middle" text-anchor="middle" font-size="24" fill="#fff" font-family="Helvetica, Arial, sans-serif">${firstLetter}</text>
                          </svg>`;
                          const encodedSVG = `data:image/svg+xml;base64,${btoa(
                            svg
                          )}`;
                          // @ts-ignore
                          e.target.src = encodedSVG;
                        };
                      }}
                    />
                    {item.symbol}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderBottom: "2px solid #262626",
                    color: "white",
                  }}
                  className="font-[500]"
                >
                  {item.longName}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderBottom: "2px solid #262626",
                  }}
                >
                  <Box className="flex gap-2 flex-wrap justify-center">
                    <Chip
                      className="text-primaryWhite"
                      key={item.industry}
                      label={item.industry}
                      sx={{
                        backgroundColor: getIndustryColor(item.industry).bg,
                        color: getIndustryColor(item.industry).color,
                        "&:hover": {
                          backgroundColor: getIndustryColor(item.industry).bg,
                          opacity: 0.8,
                        },
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    borderBottom: "2px solid #262626",
                  }}
                >
                  <Box className="flex gap-2 flex-wrap justify-center">
                    <Chip
                      className="text-primaryWhite"
                      key={item.sector}
                      label={item.sector}
                      sx={{
                        backgroundColor: getIndustryColor(item.sector).bg,
                        color: getIndustryColor(item.sector).color,
                        "&:hover": {
                          backgroundColor: getIndustryColor(item.sector).bg,
                          opacity: 0.8,
                        },
                        cursor: "pointer",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    borderBottom: "2px solid #262626",
                    color: "white",
                  }}
                >
                  {formatMarketCap(item.marketCap)}
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    borderBottom: "2px solid #262626",
                    color: "white",
                  }}
                  className="flex-col"
                >
                  <div>{formatPrice(item.currentPrice)}</div>
                  <div
                    style={{
                      color: calculatePriceDifference(
                        item.currentPrice,
                        item.previousClose
                      ).color,
                    }}
                  >
                    {
                      calculatePriceDifference(
                        item.currentPrice,
                        item.previousClose
                      ).formattedDifference
                    }
                  </div>
                </TableCell>
                <TableCell
                  sx={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    borderBottom: "2px solid #262626",
                  }}
                  className="dark:text-primaryWhite"
                >
                  <FavouriteButton
                    initialState={false}
                    company={item.symbol}
                  ></FavouriteButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TableCompanies;
