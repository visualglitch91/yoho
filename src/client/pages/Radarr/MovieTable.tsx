import { keyBy } from "lodash";
import { useMemo } from "react";
import { Alert } from "@mui/material";
import CenteredMessage from "$common/CenteredMessage";
import DataGrid from "$common/DataGrid";
import MediaCard from "$common/MediaCard";
import useIsMobile from "$common/hooks/usIsMobile";
import { Movie } from "./types";
import useConfig from "./useConfig";
import MovieStatus from "./MovieStatus";

export default function MovieTable({
  movies,
  onSelect,
}: {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}) {
  const config = useConfig();
  const isMobile = useIsMobile();

  const qualityProfileMap = useMemo(
    () => keyBy(config?.qualityProfiles, "id") || {},
    [config?.qualityProfiles]
  );

  const getQualityProfile = (movie: Movie) => {
    return (
      (movie.qualityProfileId
        ? qualityProfileMap[movie.qualityProfileId]?.name
        : undefined) || "-"
    );
  };

  if (movies.length === 0) {
    return (
      <CenteredMessage>
        <Alert icon={false}>No movies found</Alert>
      </CenteredMessage>
    );
  }

  return (
    <DataGrid
      cursorPointer
      rowHeight={isMobile ? 120 : 68}
      rows={movies}
      initialState={{
        sorting: { sortModel: [{ field: "sortTitle", sort: "asc" }] },
      }}
      onRowClick={({ row }) => onSelect(row)}
      disableHeaders={isMobile}
      columnVisibilityModel={{
        qualityProfile: !isMobile,
        monitored: !isMobile,
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
                posterAspectRatio="2/3"
                posterHeight={isMobile ? 90 : 50}
                title={row.title}
                subtitle={getQualityProfile(row)}
                chip={<MovieStatus movie={row} />}
              />
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
          valueGetter: ({ row }) => getQualityProfile(row),
        },
        {
          field: "monitored",
          headerName: "Status",
          align: "center",
          headerAlign: "center",
          width: 130,
          sortable: false,
          renderCell: ({ row }) => <MovieStatus movie={row} />,
        },
      ]}
    />
  );
}
