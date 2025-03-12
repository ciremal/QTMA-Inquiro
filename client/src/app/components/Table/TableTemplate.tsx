import React, { useState, useMemo, useTransition } from "react";
import { TablePagination, Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import SearchBar from "../searchbar";
import { interBold, robotoSemibold } from "../../ui/fonts";
import TableFilters from "./TableFilters";
import TableNoData from "./TableNoData";
import TableCompanies from "./TableCompanies";
import { useTheme } from "next-themes";
import Carousel from "../Carousel";

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

  if (companyResult) {
    // AI search case
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
          console.log(priceRange);
          const price = Number(item.currentPrice);
          return price >= priceRange[0] && price <= priceRange[1];
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
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [marketCapRange, setMarketCapRange] = useState("");

  const [blurb, setBlurb] = useState<{ blurb: string } | null>(null);
  const [companies, setCompanies] = useState<{ companies: any[] } | null>(null);
  const [isLoadingAISearch, setIsLoadingAISearch] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { theme } = useTheme();

  const industries: string[] = useMemo(() => {
    if (!data) return [];

    return [
      ...new Set(
        data.map((item: { industry?: string }) => item.industry ?? "") // Ensure string type
      ),
    ]
      .filter((industry): industry is string => industry !== "") // Type predicate for filtering
      .sort();
  }, [data]);

  // Column definitions
  const columns = [
    { id: "symbol", label: "Ticker", numeric: false },
    { id: "longName", label: "Company Name", numeric: false },
    { id: "industry", label: "Industry", numeric: false },
    { id: "sector", label: "Sector", numeric: false },
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
    setPriceRange([0, 10000]);
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
    return <TableNoData columns={columns} />;
  }

  return (
    <Box className={`w-full font-sans md:px-36 px-8`}>
      {/* Filters Section */}
      <Box className="mb-4 space-y-4">
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setPage={setPage}
          setBlurb={setBlurb}
          setCompanies={setCompanies}
          setIsLoadingAISearch={setIsLoadingAISearch}
          data={data}
        />
        <Carousel data={data} />

        <Box className="flex w-full flex-col justify-center items-center">
          {isLoadingAISearch && <CircularProgress />}
        </Box>
        {blurb && (
          <div className="results mt-8">
            {/* Display the blurb */}
            <p className={`blurb text-lg ${robotoSemibold.className}`}>
              {blurb.blurb.replaceAll("*", "")}
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
          <p className={`pt-8 ${interBold.className}`}>Filter By:</p>
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
      <TableCompanies
        columns={columns}
        orderBy={orderBy}
        order={order}
        handleSort={handleSort}
        paginatedData={paginatedData}
        isPending={isPending}
        startTransition={startTransition}
        router={router}
      />

      {/* Pagination */}
      <TablePagination
        style={{
          color:
            theme === "dark" ? "var(--primaryWhite)" : "var(--primaryBlack)",
        }}
        sx={{
          "& .MuiTablePagination-selectIcon": {
            color: theme === "dark" ? "var(--primaryWhite)" : "black",
          },
          "& .MuiTablePagination-actions button.Mui-disabled": {
            color: theme === "dark" ? "gray" : "black",
          },
        }}
        rowsPerPageOptions={[25, 50, 100, 200]}
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
