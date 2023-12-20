import { useMemo } from "react";
import { keyBy } from "lodash";
import { Checkbox, Alert } from "@mui/material";
import CenteredMessage from "$common/CenteredMessage";
import DataGrid from "$common/DataGrid";
import useIsMobile from "$common/hooks/usIsMobile";
import MediaCard from "$common/MediaCard";
import { Show } from "./types";
import useConfig from "./useConfig";
import ShowStatus from "./ShowStatus";

export default function ShowsTable({
  shows,
  onSelect,
}: {
  shows: Show[];
  onSelect: (movie: Show) => void;
}) {
  const config = useConfig();
  const isMobile = useIsMobile();

  const qualityProfileMap = useMemo(
    () => keyBy(config?.qualityProfiles, "id") || {},
    [config?.qualityProfiles]
  );

  const getQualityProfile = (show: Show) => {
    return show.qualityProfileId
      ? qualityProfileMap[show.qualityProfileId]?.name
      : undefined;
  };

  const getDownloaded = (show: Show) => {
    if (show.statistics.episodeCount === 0) {
      return undefined;
    }

    return `${show.statistics.episodeFileCount} / ${show.statistics.episodeCount}`;
  };

  if (shows.length === 0) {
    return (
      <CenteredMessage>
        <Alert icon={false}>No TV Shows found</Alert>
      </CenteredMessage>
    );
  }

  return (
    <DataGrid
      cursorPointer
      rowHeight={isMobile ? 120 : 68}
      rows={shows}
      getRowId={(row) => row.id || row.tvdbId}
      initialState={{
        sorting: { sortModel: [{ field: "sortTitle", sort: "asc" }] },
      }}
      onRowClick={({ row }) => onSelect(row)}
      disableHeaders={isMobile}
      columnVisibilityModel={{
        qualityProfile: !isMobile,
        downloaded: !isMobile,
        monitored: !isMobile,
        ended: !isMobile,
      }}
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
              <MediaCard
                minimal={!isMobile}
                posterSrc={poster || ""}
                posterHeight={isMobile ? 90 : 50}
                posterAspectRatio="2/3"
                title={row.title}
                subtitle={[
                  row.ended ? "Ended" : "Continuing",
                  getQualityProfile(row),
                  getDownloaded(row),
                ]
                  .filter(Boolean)
                  .join(" • ")}
                chip={<ShowStatus show={row} />}
              />
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
          valueGetter: ({ row }) => getQualityProfile(row) || "-",
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
          renderCell: ({ row }) => getDownloaded(row) || "-",
        },
        {
          field: "monitored",
          headerName: "Status",
          align: "center",
          headerAlign: "center",
          width: 160,
          sortable: false,
          renderCell: ({ row }) => <ShowStatus show={row} />,
        },
      ]}
    />
  );
}
