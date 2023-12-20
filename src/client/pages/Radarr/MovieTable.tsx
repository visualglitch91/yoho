import { keyBy } from "lodash";
import { useMemo } from "react";
import { Chip, Stack, Alert } from "@mui/material";
import CenteredMessage from "$common/CenteredMessage";
import DataGrid from "$common/DataGrid";
import Poster from "$common/Poster";
import { Movie } from "./types";
import useConfig from "./useConfig";

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

  if (movies.length === 0) {
    return (
      <CenteredMessage>
        <Alert icon={false}>No movies found</Alert>
      </CenteredMessage>
    );
  }

  return (
    <DataGrid
      sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
      rowHeight={68}
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
          minWidth: 300,
          renderCell: ({ row }) => {
            const poster = row.images.find(
              (it) => it.coverType === "poster"
            )?.remoteUrl;

            return (
              <Stack spacing={2} direction="row" alignItems="center">
                <Poster aspectRatio="2/3" height={50} src={poster || ""} />
                <span>{row.title}</span>
              </Stack>
            );
          },
        },
        {
          field: "qualityProfile",
          headerName: "Quality Profile",
          align: "center",
          headerAlign: "center",
          width: 230,
          sortable: false,
          valueGetter: ({ row }) =>
            row.qualityProfileId
              ? qualityProfileMap[row.qualityProfileId]?.name
              : "-",
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
