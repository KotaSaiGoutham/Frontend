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
                sx={{ ...commonSx, minWidth: column.minWidth }}
                // Keep this line as is, it sets the overall sort direction for the table cell
                sortDirection={isActive ? order : false}
              >
                {column.hasSort ? (
                  <TableSortLabel
                    active={isActive}
                    // This is the key change: always provide a direction,
                    // even when not active. This forces the arrow to show.
                    direction={isActive ? order : "asc"}
                    onClick={() => handleSortRequest(column.id)}
                    hideSortIcon={false} // Ensure this is always false
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