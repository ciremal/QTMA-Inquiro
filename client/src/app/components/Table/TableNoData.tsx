import {
  Box,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

type TableNoDataProps = {
  columns: any[];
};

const TableNoData = ({ columns }: TableNoDataProps) => {
  return (
    <Box className="w-full max-w-7xl">
      <Skeleton height={56} />
      <TableContainer className="bg-secondaryBlack" component={Paper}>
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
};

export default TableNoData;
