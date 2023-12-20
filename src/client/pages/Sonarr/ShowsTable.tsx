import { useMemo } from "react";
import { keyBy } from "lodash";
import { Chip, Stack, Checkbox, Alert } from "@mui/material";
import CenteredMessage from "$common/CenteredMessage";
import Poster from "$common/Poster";
import DataGrid from "$common/DataGrid";
import { Show } from "./types";
import useConfig from "./useConfig";

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
  const config = useConfig();

  const qualityProfileMap = useMemo(
    () => keyBy(config?.qualityProfiles, "id") || {},
    [config?.qualityProfiles]
  );

  if (shows.length === 0) {
    return (
      <CenteredMessage>
        <Alert icon={false}>No TV Shows found</Alert>
      </CenteredMessage>
    );
  }

  return (
    <DataGrid
      sx={{ "& .MuiDataGrid-row": { cursor: "pointer" } }}
      rowHeight={68}
      rows={shows}
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
          width: 200,
          sortable: false,
          valueGetter: ({ row }) =>
            row.qualityProfileId
              ? qualityProfileMap[row.qualityProfileId]?.name
              : "-",
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
