import { keyBy } from "lodash";
import { useMemo } from "react";
import { Chip, styled, Stack } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Movie } from "./types";
import useConfig from "./useConfig";

const Poster = styled("img")(({ theme }) => ({
  aspectRatio: "140/210",
  width: 30,
  objectFit: "cover",
  background: theme.palette.background.default,
  textIndent: "-10000px", // Hide broken image indicator
}));

export default function MovieTable({
  movies,
  onSelect,
}: {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}) {
  const config = useConfig();

  const qualityProfileMap = useMemo(
    () => keyBy(config?.qualityProfiles, "id") || {},
    [config?.qualityProfiles]
  );

  return (
    <DataGrid
      sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
      autoPageSize
      disableColumnMenu
      disableColumnFilter
      disableColumnSelector
      rowSelection={false}
      rowHeight={60}
      rows={movies}
      initialState={{
        sorting: { sortModel: [{ field: "sortTitle", sort: "asc" }] },
      }}
      onRowClick={({ row }) => onSelect(row)}
      columns={[
        {
          field: "sortTitle",
          headerName: "Title",
          flex: 1,
          renderCell: ({ row }) => {
            const poster = row.images.find(
              (it) => it.coverType === "poster"
            )?.remoteUrl;

            return (
              <Stack spacing={2} direction="row" alignItems="center">
                <Poster src={poster || ""} />
                <span>{row.title}</span>
              </Stack>
            );
          },
        },
        {
          field: "qualityProfileId",
          headerName: "Quality Profile",
          align: "center",
          headerAlign: "center",
          width: 230,
          sortable: false,
          renderCell: ({ value }) => qualityProfileMap[value]?.name || "-",
        },
        {
          field: "monitored",
          headerName: "Status",
          align: "center",
          headerAlign: "center",
          width: 130,
          sortable: false,
          renderCell: ({ row }) => (
            <Chip
              size="small"
              sx={{ fontSize: 11, fontWeight: 600 }}
              color={
                !row.monitored
                  ? "warning"
                  : row.hasFile
                  ? "success"
                  : row.downloading
                  ? "primary"
                  : "error"
              }
              label={
                !row.monitored
                  ? "Unmonitored"
                  : row.hasFile
                  ? "Available"
                  : row.downloading
                  ? "Downloading"
                  : "Monitored"
              }
            />
          ),
        },
      ]}
    />
  );
}
