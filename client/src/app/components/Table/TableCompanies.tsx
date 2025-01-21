import { letterColorMap } from "@/app/lib/constants";
import { formatMarketCap, formatPrice } from "@/app/lib/formattingFunctions";
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
import { useTheme } from "next-themes";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

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
  const { theme } = useTheme();

  return (
    <div className="bg-white dark:bg-[var(--secondaryBlack)] p-6 rounded-2xl border border-[#00000033] ">
      <TableContainer
        component={Paper}
        sx={{
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
                  borderBottom: "2px solid rgba(224, 224, 224, 1)", // Thicker border
                  fontWeight: 800,
                },
              }}
            >
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.numeric ? "right" : "left"}
                  sortDirection={
                    orderBy === column.id &&
                    (order === "asc" || order === "desc")
                      ? order
                      : undefined
                  }
                >
                  <TableSortLabel
                    className="dark:text-primaryWhite"
                    active={orderBy === column.id}
                    direction={
                      orderBy === column.id &&
                      (order === "asc" || order === "desc")
                        ? order
                        : "asc"
                    }
                    onClick={() => handleSort(column.id)}
                    sx={{
                      "&.Mui-active": {
                        color:
                          theme === "dark"
                            ? "var(--primaryWhite)"
                            : "var(--primaryBlack)",
                      },
                      "&.Mui-active .MuiTableSortLabel-icon": {
                        color:
                          theme === "dark"
                            ? "var(--primaryWhite)"
                            : "var(--primaryBlack)",
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
                  style={{ fontWeight: 600 }}
                >
                  <Box className="flex items-center gap-2 dark:text-primaryWhite font-[500]">
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
                        // @ts-ignore
                        e.target.onerror = null;
                        // Creating an inline SVG to display the fallback
                        const firstLetter = item.symbol.charAt(0).toUpperCase();
                        // Get color from the map, default to black if no match
                        const fallbackColor =
                          letterColorMap[
                            firstLetter as keyof typeof letterColorMap
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
                      }}
                    />
                    {item.symbol}
                  </Box>
                </TableCell>
                <TableCell
                  className="font-[500]"
                  style={{
                    color:
                      theme === "dark"
                        ? "var(--primaryWhite)"
                        : "var(--primaryBlack)",
                  }}
                >
                  {item.longName}
                </TableCell>
                <TableCell>
                  <Box className="flex gap-2 flex-wrap">
                    <Chip
                      style={{
                        color:
                          theme === "dark"
                            ? "var(--primaryWhite)"
                            : "var(--primaryBlack)",
                      }}
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
                  align="right"
                  style={{
                    color:
                      theme === "dark"
                        ? "var(--primaryWhite)"
                        : "var(--primaryBlack)",
                  }}
                >
                  {formatMarketCap(item.marketCap)}
                </TableCell>
                <TableCell
                  align="right"
                  style={{
                    color:
                      theme === "dark"
                        ? "var(--primaryWhite)"
                        : "var(--primaryBlack)",
                  }}
                >
                  {formatPrice(item.currentPrice)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <a className="my-5" href="https://parqet.com/api">
        Logos provided by Parqet
      </a>
    </div>
  );
};

export default TableCompanies;
