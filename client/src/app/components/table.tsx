import React, { useState, useMemo } from "react";
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import getIndustryColor from "../lib/industryColors";


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
  marketCapRange: any
) => {
  if (!data) return [];

  return data.filter((item: any) => {
    const matchesSearch =
      !searchTerm ||
      item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.longName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = !industryFilter || item.industry === industryFilter;

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
      matchesSearch && matchesIndustry && matchesPriceRange && matchesMarketCap
    );
  });
};

// Price formatter
const formatPrice = (price: number) => {
  if (typeof price !== "number") return price;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

// Market cap formatter
const formatMarketCap = (marketCap: number) => {
  if (typeof marketCap !== "number") return marketCap;

  if (marketCap >= 1e12) {
    return `$${(marketCap / 1e12).toFixed(2)}T`;
  } else if (marketCap >= 1e9) {
    return `$${(marketCap / 1e9).toFixed(2)}B`;
  } else if (marketCap >= 1e6) {
    return `$${(marketCap / 1e6).toFixed(2)}M`;
  } else {
    return `$${marketCap.toLocaleString()}`;
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
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [marketCapRange, setMarketCapRange] = useState("");

  // Get unique industries for dropdown
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

  // Handle search change
  const handleSearchChange = (event: any) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Process data with sort, filter, and pagination
  const processedData = useMemo(() => {
    if (!data) return [];
    return sortData(
      filterData(data, searchTerm, industryFilter, priceRange, marketCapRange),
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
  ]);

  // Calculate paginated data
  const paginatedData = processedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // If no data
  if (!data || data.length === 0) {
    return (
      <Box className="w-full max-w-4xl">
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
    <Box className="w-full max-w-7xl font-DM">
      {/* Filters Section */}
      <Box className="mb-4 space-y-4">
        <div>
          <p className="font-bold">Filter By:</p>
        </div>
        {/* Dropdown Filters */}
        <Box className="w-3/4 flex gap-6">
          <FormControl fullWidth>
            <InputLabel
              sx={{
                "&.MuiInputLabel-root": {
                  transform: "translate(0.875rem, 0.75rem) scale(1)",
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0.875rem, -0.375rem) scale(0.75)",
                },
              }}
            >
              Industry
            </InputLabel>
            <Select
              value={industryFilter}
              label="Industry"
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setPage(0);
              }}
              sx={{
                height: "2.5rem",
                borderRadius: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0.75rem",
                },
                "& .MuiSelect-select": {
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
            >
              <MenuItem value="">All Industries</MenuItem>
              {industries.map((industry) => (
                // @ts-ignore
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              sx={{
                "&.MuiInputLabel-root": {
                  transform: "translate(0.875rem, 0.75rem) scale(1)",
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0.875rem, -0.375rem) scale(0.75)",
                },
              }}
            >
              Market Cap
            </InputLabel>
            <Select
              value={marketCapRange}
              label="Market Cap"
              onChange={(e) => {
                setMarketCapRange(e.target.value);
                setPage(0);
              }}
              sx={{
                height: "2.5rem",
                borderRadius: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0.75rem",
                },
                "& .MuiSelect-select": {
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
            >
              <MenuItem value="">All Market Caps</MenuItem>
              <MenuItem value="micro">Micro Cap (Under $300M)</MenuItem>
              <MenuItem value="small">Small Cap ($300M - $2B)</MenuItem>
              <MenuItem value="mid">Mid Cap ($2B - $10B)</MenuItem>
              <MenuItem value="large">Large Cap ($10B - $200B)</MenuItem>
              <MenuItem value="mega">Mega Cap (Over $200B)</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              sx={{
                "&.MuiInputLabel-root": {
                  transform: "translate(0.875rem, 0.75rem) scale(1)",
                },
                "&.MuiInputLabel-shrink": {
                  transform: "translate(0.875rem, -0.375rem) scale(0.75)",
                },
              }}
            >
              Stock Price
            </InputLabel>
            <Select
              value={priceRange}
              label="Price Range"
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(0);
              }}
              sx={{
                height: "2.5rem",
                borderRadius: "0.75rem",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0.75rem",
                },
                "& .MuiSelect-select": {
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                },
              }}
            >
              <MenuItem value="">All Prices</MenuItem>
              <MenuItem value="under50">Under $50</MenuItem>
              <MenuItem value="50to200">$50 - $200</MenuItem>
              <MenuItem value="over200">Over $200</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      {/* Container div with background and rounded corners */}
      <div className="bg-gray-50 p-6 rounded-2xl">
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "14px",
            overflow: "hidden",
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
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  hover
                >
                  <TableCell
                    component="th"
                    scope="row"
                    style={{ fontWeight: 600 }}
                  >
                    <Box className="flex items-center gap-2">
                      <img
                        src={`https://assets.parqet.com/logos/symbol/${item.symbol.toUpperCase()}?format=jpg`}
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
                          // @ts-ignore
                          e.target.src = "https://via.placeholder.com/32";
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
        rowsPerPageOptions={[5, 10, 25]}
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
