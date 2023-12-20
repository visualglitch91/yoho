import { Pagination as MuiPagination, Stack } from "@mui/material";
import { useGridApiContext, useGridSelector } from "@mui/x-data-grid";

export default function Footer() {
  const apiRef = useGridApiContext();
  const { page, pageCount } = useGridSelector(apiRef, (state: any) => {
    const { page, pageSize } = state.pagination.paginationModel;
    const rowCount = state.rows.totalRowCount;
    const pageCount = Math.ceil(rowCount / pageSize);

    console.log({
      page,
      pageSize,
      rowCount,
      pageCount,
    });

    return {
      page,
      pageCount,
    };
  });

  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={(theme) => ({
        py: 1,
        borderTop: `1px solid ${theme.palette.divider}`,
      })}
    >
      <MuiPagination
        color="primary"
        count={pageCount}
        page={page + 1}
        onChange={(_, newPage) => {
          apiRef.current.setPage(newPage - 1);
        }}
      />
    </Stack>
  );
}
