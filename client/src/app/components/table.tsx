import React, { useState, useMemo } from 'react';
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
  Alert,
  AlertTitle,
  Box,
  Skeleton,
  TextField,
  InputAdornment,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { ArrowUpward, ArrowDownward, Search } from 'lucide-react';
// Industry color mapping
const industryColors = {
  'Auto Manufacturers': { bg: '#E3F2FD', color: '#1565C0' },
  'Consumer Electronics': { bg: '#FFB2B2', color: '#FF6565' },
  'Footwear & Accessories': { bg: '#E1F5FE', color: '#0288D1' },
  'Internet Content & Information': { bg: '#E0F7FA', color: '#00838F' },
  'Internet Retail': { bg: '#F3E5F5', color: '#7B1FA2' },
  'Semiconductors': { bg: '#F1F8E9', color: '#558B2F' },
  'Software - Infrastructure': { bg: '#E8F5E9', color: '#2E7D32' },
  
  // Default color for uncategorized industries
  'default': { bg: '#F5F5F5', color: '#616161' }
};

// Helper function to get color for industry
const getIndustryColor = (industry) => {
  
  return industryColors[industry] || industryColors.default;
};

// Sort function for different data types
const sortData = (data, orderBy, order) => {
  return [...data].sort((a, b) => {
    let aValue = a[orderBy];
    let bValue = b[orderBy];
    
    if (orderBy === 'currentPrice' || orderBy === 'marketCap') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter function
const filterData = (data, searchTerm, industryFilter, priceRange, marketCapRange) => {
  if (!data) return [];
  
  return data.filter(item => {
    const matchesSearch = !searchTerm || 
      item.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.longName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.industry?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesIndustry = !industryFilter || item.industry === industryFilter;

    const matchesPriceRange = !priceRange || (() => {
      const price = Number(item.currentPrice);
      switch(priceRange) {
        case 'under50': return price < 50;
        case '50to200': return price >= 50 && price <= 200;
        case 'over200': return price > 200;
        default: return true;
      }
    })();

    const matchesMarketCap = !marketCapRange || (() => {
      const marketCap = Number(item.marketCap);
      switch(marketCapRange) {
        case 'micro': return marketCap < 300000000; // Under 300M
        case 'small': return marketCap >= 300000000 && marketCap < 2000000000; // 300M - 2B
        case 'mid': return marketCap >= 2000000000 && marketCap < 10000000000; // 2B - 10B
        case 'large': return marketCap >= 10000000000 && marketCap < 200000000000; // 10B - 200B
        case 'mega': return marketCap >= 200000000000; // Over 200B
        default: return true;
      }
    })();

    return matchesSearch && matchesIndustry && matchesPriceRange && matchesMarketCap;
  });
};

// Price formatter
const formatPrice = (price) => {
  if (typeof price !== 'number') return price;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Market cap formatter
const formatMarketCap = (marketCap) => {
  if (typeof marketCap !== 'number') return marketCap;
  
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

function StockTable({ data, isLoading, error }) {
  const [orderBy, setOrderBy] = useState('symbol');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [marketCapRange, setMarketCapRange] = useState('')

  // Get unique industries for dropdown
  const industries = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map(item => item.industry))].filter(Boolean).sort();
  }, [data]);

  // Column definitions
  const columns = [
    { id: 'symbol', label: 'Ticker', numeric: false },
    { id: 'longName', label: 'Company Name', numeric: false },
    { id: 'industry', label: 'Industry', numeric: false },
    { id: 'marketCap', label: 'Market Cap', numeric: true },
    { id: 'currentPrice', label: 'Current Price', numeric: true },
  ];

  // Handle sort request
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search change
  const handleSearchChange = (event) => {
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
  }, [data, searchTerm, orderBy, order, industryFilter, priceRange, marketCapRange]);


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
    <Box className="w-full max-w-4xl font-sans">
      {/* Filters Section */}
      <Box className="mb-4 space-y-4">
        {/* Search Field 
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by ticker, company name, or industry..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-5 h-5" />
              </InputAdornment>
            ),
          }}
        />
        */}
        <div>
          <p>
            Sort By:
          </p>
        </div>
        {/* Dropdown Filters */}
        <Box className="flex gap-6">
          <FormControl fullWidth>
            <InputLabel>Industry</InputLabel>
            <Select
              
              value={industryFilter}
              label="Industry"
              onChange={(e) => {
                setIndustryFilter(e.target.value);
                setPage(0);
              }}
            >
              <MenuItem value="">All Industries</MenuItem>
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
            
          <FormControl fullWidth>
            <InputLabel>Market Cap</InputLabel>
            <Select
              value={marketCapRange}
              label="Market Cap"
              onChange={(e) => {
                setMarketCapRange(e.target.value);
                setPage(0);
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
            <InputLabel>Stock Price</InputLabel>
            <Select
              value={priceRange}
              label="Price Range"
              onChange={(e) => {
                setPriceRange(e.target.value);
                setPage(0);
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

      <TableContainer 
        component={Paper}
        sx={{
          '& .MuiTableRow-root:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        <Table aria-label="stock information table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.numeric ? 'right' : 'left'}
                  sortDirection={orderBy === column.id ? order : false}
                >
                  <TableSortLabel
                    className="font-bold"
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                    IconComponent={order === 'asc' ? ArrowUpward : ArrowDownward}
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
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                hover
              >
                <TableCell component="th" scope="row">
                  {item.symbol}
                </TableCell>
                <TableCell >{item.longName}</TableCell>
                <TableCell>
                  <Box className="flex gap-2 flex-wrap ">
                    <Chip
                      className="font-bold"
                      key={item.industry}
                      label={item.industry}
                      sx={{
                        backgroundColor: getIndustryColor(item.industry).bg,
                        color: getIndustryColor(item.industry).color,
                        '&:hover': {
                          backgroundColor: getIndustryColor(item.industry).bg,
                          opacity: 0.8,
                        },
                        cursor: 'pointer',
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