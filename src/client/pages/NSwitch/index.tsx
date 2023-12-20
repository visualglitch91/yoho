import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableContainer,
  CircularProgress,
} from "@mui/material";
import { api, humanizeBytes } from "$common/utils";
import DataGrid from "$common/DataGrid";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import useModal from "$common/hooks/useModal";
import StandardDialog from "$common/StandardDialog";
import MediaCard from "$common/MediaCard";

export default function NSwitch() {
  const mount = useModal();
  const $games = useQuery({
    queryKey: ["Switch", "Games"],
    queryFn: () => {
      return api.get("/switch/games").then(
        (res) =>
          res.data as {
            image: string;
            href: string;
            title: string;
            files: string[];
          }[]
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
          cursorPointer
          disableHeaders
          rowHeight={88}
          rows={$games.data || []}
          initialState={{
            sorting: { sortModel: [{ field: "title", sort: "asc" }] },
          }}
          columns={[
            {
              field: "title",
              headerName: "Title",
              flex: 1,
              minWidth: 300,
              renderCell: ({ row }) => (
                <MediaCard
                  posterHeight={60}
                  posterSrc={row.image || ""}
                  title={row.title}
                  subtitle={`${row.files.length} files`}
                />
              ),
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
