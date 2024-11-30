import React, { useState, useMemo, useTransition } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
  Box,
  Skeleton,
  Chip,
  CircularProgress,
} from "@mui/material";
import getIndustryColor from "../lib/industryColors";
import { useRouter } from "next/navigation";
import SearchBar from "./searchbar";
import { interBold, robotoSemibold } from "../ui/fonts";
import { formatMarketCap, formatPrice } from "../lib/formattingFunctions";
import TableFilters from "./tableFilters";

// Sort function for different data types
const sortData = (data: any, orderBy: any, order: any) => {
  return [...data].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];

    if (orderBy === "currentPrice" || orderBy === "marketCap") {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return order === "asc" ? -1 : 1;
    if (aValue > bValue) return order === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter function
const filterData = (
  data: any,
  searchTerm: any,
  industryFilter: any,
  priceRange: any,
  marketCapRange: any,
  blurbResult: { blurb: string } | null,
  companyResult: { companies: any[] } | null
) => {
  if (!data) return [];

  if (blurbResult) {
    // AI search case
    console.log(data);
    console.log(companyResult);
    const matches = data.filter((item: any) =>
      companyResult?.companies.includes(item.symbol)
    );
    return matches;
  } else {
    // Normal search, filter, etc.
    return data.filter((item: any) => {
      // checks if the strings match the symbol, the long name, or the industry
      const matchesSearch =
        !searchTerm ||
        item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.longName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.industry?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry =
        !industryFilter || item.industry === industryFilter;

      const matchesPriceRange =
        !priceRange ||
        (() => {
          const price = Number(item.currentPrice);
          switch (priceRange) {
            case "under50":
              return price < 50;
            case "50to200":
              return price >= 50 && price <= 200;
            case "over200":
              return price > 200;
            default:
              return true;
          }
        })();

      const matchesMarketCap =
        !marketCapRange ||
        (() => {
          const marketCap = Number(item.marketCap);
          switch (marketCapRange) {
            case "micro":
              return marketCap < 300000000; // Under 300M
            case "small":
              return marketCap >= 300000000 && marketCap < 2000000000; // 300M - 2B
            case "mid":
              return marketCap >= 2000000000 && marketCap < 10000000000; // 2B - 10B
            case "large":
              return marketCap >= 10000000000 && marketCap < 200000000000; // 10B - 200B
            case "mega":
              return marketCap >= 200000000000; // Over 200B
            default:
              return true;
          }
        })();

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesPriceRange &&
        matchesMarketCap
      );
    });
  }
};

// Function to assign color based on the first letter of the ticker symbol
const letterColorMap = {
  A: "#FFD700", // Gold
  B: "#FF6347", // Tomato
  C: "#4682B4", // Steel Blue
  D: "#32CD32", // Lime Green
  E: "#FF69B4", // Hot Pink
  F: "#8A2BE2", // Blue Violet
  G: "#FF4500", // Orange Red
  H: "#20B2AA", // Light Sea Green
  I: "#FFB6C1", // Light Pink
  J: "#7B68EE", // Medium Slate Blue
  K: "#FF8C00", // Dark Orange
  L: "#DA70D6", // Orchid
  M: "#2E8B57", // Sea Green
  N: "#6A5ACD", // Slate Blue
  O: "#DB7093", // Pale Violet Red
  P: "#FF6347", // Tomato
  Q: "#5F9EA0", // Cadet Blue
  R: "#D2691E", // Chocolate
  S: "#9ACD32", // Yellow Green
  T: "#40E0D0", // Turquoise
  U: "#EE82EE", // Violet
  V: "#8B0000", // Dark Red
  W: "#00CED1", // Dark Turquoise
  X: "#B22222", // Fire Brick
  Y: "#228B22", // Forest Green
  Z: "#FF00FF", // Magenta
};

type StockTableProps = {
  data: any;
  isLoading: boolean;
  error: any;
};

function StockTable({ data, isLoading, error }: StockTableProps) {
  const [orderBy, setOrderBy] = useState("symbol");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [marketCapRange, setMarketCapRange] = useState("");

  const [blurb, setBlurb] = useState<{ blurb: string } | null>(null);
  const [companies, setCompanies] = useState<{ companies: any[] } | null>(null);
  const [isLoadingAISearch, setIsLoadingAISearch] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const industries = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((item: any) => item.industry))]
      .filter(Boolean)
      .sort();
  }, [data]);

  // Column definitions
  const columns = [
    { id: "symbol", label: "Ticker", numeric: false },
    { id: "longName", label: "Company Name", numeric: false },
    { id: "industry", label: "Industry", numeric: false },
    { id: "marketCap", label: "Market Cap", numeric: true },
    { id: "currentPrice", label: "Current Price", numeric: true },
  ];

  // Handle sort request
  const handleSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleReset = () => {
    setIndustryFilter("");
    setMarketCapRange("");
    setPriceRange("");
    setSearchTerm("");
    setBlurb(null);
    setCompanies(null);
  };

  // Process data with sort, filter, and pagination
  const processedData = useMemo(() => {
    if (!data) return [];
    return sortData(
      filterData(
        data,
        searchTerm,
        industryFilter,
        priceRange,
        marketCapRange,
        blurb,
        companies // Added for ai search
      ),
      orderBy,
      order
    );
  }, [
    data,
    searchTerm,
    orderBy,
    order,
    industryFilter,
    priceRange,
    marketCapRange,
    blurb,
    companies, // Added for ai search
  ]);

  // Calculate paginated data
  const paginatedData = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // If no data
  if (!data || data.length === 0) {
    return (
      <Box className="w-full max-w-7xl">
        <Skeleton height={56} />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={column.id}>
                    <Skeleton />
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {[1, 2, 3].map((row) => (
                <TableRow key={row}>
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton animation="wave" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }

  return (
    <Box className={`w-full font-DM px-36`}>
      {/* Filters Section */}
      <Box className="mb-4 space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
          setBlurb={setBlurb}
          setCompanies={setCompanies}
          setIsLoadingAISearch={setIsLoadingAISearch}
        />

        <Box className="flex w-full flex-col justify-center items-center">
          {isLoadingAISearch && <CircularProgress />}
        </Box>
        {blurb && (
          <div className="results mt-8">
            {/* Display the blurb */}
            <p className={`blurb text-lg ${robotoSemibold.className}`}>
              {blurb.blurb}
            </p>
            <br></br>
            <div>
              <p className={`${robotoSemibold.className}`}>
                Related companies are listed below in the table.
              </p>
            </div>

            {/* Dropdown Filters */}
            <Box className="w-3/4 flex gap-6">{/* Dropdowns go here */}</Box>
          </div>
        )}
        <div>
          <p className={`pt-12 ${interBold.className}`}>Filter By:</p>
        </div>
        {/* Dropdown Filters */}
        <TableFilters
          industryFilter={industryFilter}
          setIndustryFilter={setIndustryFilter}
          setPage={setPage}
          industries={industries}
          marketCapRange={marketCapRange}
          setMarketCapRange={setMarketCapRange}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          handleReset={handleReset}
        />
      </Box>

      {/* Container div with background and rounded corners */}
      <div className="bg-gray-50 p-6 rounded-2xl">
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
                      className="font-bold"
                      active={orderBy === column.id}
                      direction={
                        orderBy === column.id &&
                        (order === "asc" || order === "desc")
                          ? order
                          : "asc"
                      }
                      onClick={() => handleSort(column.id)}
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
                  sx={{
                    "&:last-child td, &:last-child th": { border: 0 },
                    cursor: isPending ? "wait" : "pointer",
                    "&:active": {
                      opacity: 0.7,
                      transform: "scale(0.98)",
                      transition: "transform 0.1s ease-in-out",
                    },
                  }}
                  hover
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
                    <Box className="flex items-center gap-2">
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
                        const fallbackColor = letterColorMap[firstLetter] || "#000000";
                        const svg = `
                          <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
                            <rect width="100%" height="100%" fill="${fallbackColor}" />
                            <text x="50%" y="50%" dy=".1em" alignment-baseline="middle" text-anchor="middle" font-size="24" fill="#fff" font-family="Helvetica, Arial, sans-serif">${firstLetter}</text>
                          </svg>`;
                        const encodedSVG = `data:image/svg+xml;base64,${btoa(svg)}`;
                        // @ts-ignore
                        e.target.src = encodedSVG;
                      }}
                    />
                    {item.symbol}
                    </Box>
                  </TableCell>
                  <TableCell style={{ fontWeight: 600 }}>
                    {item.longName}
                  </TableCell>
                  <TableCell>
                    <Box className="flex gap-2 flex-wrap">
                      <Chip
                        className="font-bold"
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
                  <TableCell align="right">
                    {formatMarketCap(item.marketCap)}
                  </TableCell>
                  <TableCell align="right">
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

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[25, 50, 100]}
        component="div"
        count={processedData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}

export default StockTable;
