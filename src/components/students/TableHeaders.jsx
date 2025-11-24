import {
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  Box,
} from "@mui/material";

const TableHeaders = ({ columns, order, orderBy, handleSortRequest, columnVisibility, showSubjectColumn }) => {
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
          const isVisible =
            columnVisibility && columnVisibility[column.id] !== undefined
              ? columnVisibility[column.id]
              : true;

          const shouldRender =
            isVisible || (column.id === "subject" && showSubjectColumn);

          if (shouldRender || column.id === "sNo") {
            const isActive = orderBy === column.id;

            return (
              <TableCell
                key={column.id}
                align={column.align}
                sx={{ 
                  ...commonSx, 
                  minWidth: column.minWidth,
                  // Add cursor pointer for better UX
                  cursor: column.hasSort ? 'pointer' : 'default'
                }}
                sortDirection={isActive ? order : false}
              >
                {column.hasSort ? (
                  <TableSortLabel
                    active={isActive}
                    direction={isActive ? order : 'asc'}
                    onClick={() => handleSortRequest(column.id)}
                    // Remove hideSortIcon to always show the icon
                    sx={{
                      '& .MuiTableSortLabel-icon': {
                        opacity: 1, // Force the icon to be visible
                        color: isActive ? '#1976d2' : 'rgba(0, 0, 0, 0.54)'
                      }
                    }}
                  >
                    {column.icon ? (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <column.icon
                          style={{ marginRight: 8, color: "#1976d2" }}
                        />
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
                      justifyContent:
                        column.align === "center" ? "center" : "flex-start",
                    }}
                  >
                    {column.icon && (
                      <column.icon
                        style={{ marginRight: 8, color: "#1976d2" }}
                      />
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