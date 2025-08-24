import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
} from "@mui/material";

const TableHeaders = ({ columns, order, orderBy, handleSortRequest, columnVisibility,showSubjectColumn  }) => {
  // Common styles for all cells
  const commonSx = {
    fontWeight: "bold",
    whiteSpace: "nowrap",
    p: 1.5,
    textTransform: "uppercase",
    fontSize: "0.9rem",
    color: "#1a237e",
  };

  return (
    <TableHead
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        backgroundColor: "#e3f2fd",
      }}
    >
      <TableRow
        sx={{
          borderBottom: "2px solid #1976d2",
          backgroundColor: "#f5faff",
        }}
      >
        {columns.map((column) => {
          // Conditional rendering based on columnVisibility and other flags
          const shouldRender = columnVisibility[column.id] || (column.id === 'subject' && showSubjectColumn);

          if (shouldRender || column.id === 'sNo') { // S.No. is always visible
            return (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ ...commonSx, minWidth: column.minWidth }}
              >
                {column.hasSort ? (
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : "asc"}
                    onClick={() => handleSortRequest(column.id)}
                  >
                    {column.icon ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <column.icon style={{ marginRight: 8, color: "#1976d2" }} />
                        {column.label}
                      </Box>
                    ) : (
                      column.label
                    )}
                  </TableSortLabel>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: column.align === 'center' ? 'center' : 'flex-start',
                    }}
                  >
                    {column.icon && (
                      <column.icon style={{ marginRight: 8, color: "#1976d2" }} />
                    )}
                    {column.label}
                  </Box>
                )}
              </TableCell>
            );
          }
          return null;
        })}
      </TableRow>
    </TableHead>
  );
};

export default TableHeaders;