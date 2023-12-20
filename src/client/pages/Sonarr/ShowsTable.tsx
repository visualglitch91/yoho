import { Chip, styled, Stack, Checkbox } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Show } from "./types";

const Poster = styled("img")(({ theme }) => ({
  aspectRatio: "140/210",
  width: 30,
  objectFit: "cover",
  background: theme.palette.background.default,
  textIndent: "-10000px", // Hide broken image indicator
}));

function getPercent(show: Show) {
  return show.statistics.episodeCount === 0
    ? 100
    : (show.statistics.episodeFileCount / show.statistics.episodeCount) * 100;
}

export default function ShowsTable({
  shows,
  onSelect,
}: {
  shows: Show[];
  onSelect: (movie: Show) => void;
}) {
  return (
    <DataGrid
      sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
      autoPageSize
      disableColumnMenu
      disableColumnFilter
      disableColumnSelector
      rowHeight={60}
      rowSelection={false}
      rows={shows}
      initialState={{
        sorting: { sortModel: [{ field: "title", sort: "asc" }] },
      }}
      onRowClick={({ row }) => onSelect(row)}
      columns={[
        {
          field: "title",
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
          width: 200,
          sortable: false,
          renderCell: ({ value }) => value || "-",
        },
        {
          field: "ended",
          headerName: "Ended",
          align: "center",
          headerAlign: "center",
          width: 100,
          sortable: false,
          renderCell: ({ value }) => <Checkbox disabled checked={value} />,
        },
        {
          field: "downloaded",
          headerName: "Downloaded",
          align: "center",
          headerAlign: "center",
          width: 200,
          renderCell: ({ row }) =>
            `${row.statistics.episodeFileCount} / ${row.statistics.episodeCount}`,
        },
        {
          field: "monitored",
          headerName: "Status",
          align: "center",
          headerAlign: "center",
          width: 160,
          sortable: false,
          renderCell: ({ row }) => {
            const percent = getPercent(row);

            return (
              <Chip
                size="small"
                sx={{ fontSize: 11, fontWeight: 600 }}
                color={
                  !row.path
                    ? "warning"
                    : row.downloading
                    ? "primary"
                    : percent === 100
                    ? "success"
                    : percent > 0
                    ? "info"
                    : "error"
                }
                label={
                  !row.path
                    ? "Unmonitored"
                    : row.downloading
                    ? "Downloading"
                    : percent === 100
                    ? "All Available"
                    : percent > 0
                    ? "Some Available"
                    : "Unavailable"
                }
              />
            );
          },
        },
      ]}
    />
  );
}
