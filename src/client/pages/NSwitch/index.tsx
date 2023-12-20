import { useQuery } from "@tanstack/react-query";
import { DataGrid } from "@mui/x-data-grid";
import {
  Stack,
  Table,
  styled,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import { api, humanizeBytes } from "$common/utils";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import useModal from "$common/hooks/useModal";
import StandardDialog from "$common/StandardDialog";

const Poster = styled("img")(({ theme }) => ({
  aspectRatio: "1/1",
  height: 50,
  objectFit: "cover",
  background: theme.palette.background.default,
  textIndent: "-10000px", // Hide broken image indicator
}));

export default function NSwitch() {
  const mount = useModal();
  const $games = useQuery({
    queryKey: ["Switch", "Games"],
    queryFn: () => {
      return api
        .get("/switch/games")
        .then(
          (res) => res.data as { image: string; href: string; title: string }[]
        );
    },
  });

  return (
    <PageLayout title="Nintendo Switch">
      {$games.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <DataGrid
          sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
          autoPageSize
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          rowSelection={false}
          rowHeight={80}
          rows={$games.data || []}
          initialState={{
            sorting: { sortModel: [{ field: "title", sort: "asc" }] },
          }}
          columns={[
            {
              field: "title",
              headerName: "Title",
              flex: 1,
              renderCell: ({ row }) => (
                <Stack spacing={2} direction="row" alignItems="center">
                  <Poster src={row.image || ""} />
                  <span>{row.title}</span>
                </Stack>
              ),
            },
            {
              field: "files",
              headerName: "Files",
              align: "center",
              headerAlign: "center",
              width: 230,
              sortable: false,
              valueFormatter: ({ value }) => value.length,
            },
          ]}
          onRowClick={({ row }) => {
            mount((props) => (
              <StandardDialog {...props} title={row.title}>
                <TableContainer sx={{ minWidth: 400 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>File</TableCell>
                        <TableCell align="right">Size</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {row.files.map((file: { name: string; size: number }) => (
                        <TableRow key={file.name}>
                          <TableCell component="th" scope="row">
                            {file.name}
                          </TableCell>
                          <TableCell
                            align="right"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {humanizeBytes(file.size)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </StandardDialog>
            ));
          }}
        />
      )}
    </PageLayout>
  );
}
