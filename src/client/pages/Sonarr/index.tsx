import { useState } from "react";
import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import AppBar from "$common/Layout/AppBar";
import { api } from "$common/utils";
import { Box } from "@mui/material";
import MediaItem from "$common/MediaItem";
import SearchBar from "$common/SearchBar";

export default function Sonarr() {
  const [search, setSearch] = useState("");

  const $series = useQuery({
    queryKey: ["Sonarr", "Series", search],
    queryFn: () => {
      return Promise.all([
        api
          .get(
            search
              ? `/sonarr/v3/series/lookup?term=${search}`
              : "/sonarr/v3/series"
          )
          .then((res) =>
            orderBy(res.data, ["sortTitle", "title"], ["asc", "asc"]).filter(
              (it) =>
                it.runtime !== 0 &&
                it.images.find((it: any) => it.coverType === "poster")
                  ?.remoteUrl &&
                it.studio !== ""
            )
          ),
        api.get("/sonarr/v3/queue/details?all=true").then((res) => res.data),
      ]).then(([series, queue]) => {
        const seriesInQueue = queue
          .map((it: any) => it.seriesId)
          .filter(Boolean);

        return series.map((it) => ({
          ...it,
          downloading: seriesInQueue.includes(it.id),
        }));
      }) as Promise<
        {
          id: string;
          title: string;
          downloading: boolean;
          ended: boolean;
          images: {
            coverType: string;
            remoteUrl: string;
          }[];
          path: string;
          statistics: {
            episodeCount: number;
            episodeFileCount: number;
          };
        }[]
      >;
    },
  });

  return (
    <>
      <AppBar title="Sonarr" />

      <SearchBar
        onSearch={(term) => {
          if (search === term) {
            $series.refetch();
          } else {
            setSearch(term);
          }
        }}
      />

      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {($series.data || []).map((item) => {
          const percent =
            item.statistics.episodeCount === 0
              ? 100
              : (item.statistics.episodeFileCount /
                  item.statistics.episodeCount) *
                100;

          return (
            <MediaItem
              key={item.id}
              poster={
                item.images.find((it) => it.coverType === "poster")
                  ?.remoteUrl || ""
              }
              title={item.title}
              percent={percent}
              color={
                !item.path
                  ? "warning"
                  : item.downloading
                  ? "primary"
                  : percent === 100
                  ? item.ended
                    ? "success"
                    : "info"
                  : "error"
              }
            />
          );
        })}
      </Box>
    </>
  );
}
