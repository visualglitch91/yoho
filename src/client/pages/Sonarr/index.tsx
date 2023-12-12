import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import AppBar from "$common/Layout/AppBar";
import { api } from "$common/utils";
import { Box } from "@mui/material";
import MediaItem from "$common/MediaItem";

export default function Sonarr() {
  const $movies = useQuery({
    queryKey: ["Sonarr", "Series"],
    queryFn: () => {
      return Promise.all([
        api
          .get("/sonarr/v3/series")
          .then((res) =>
            orderBy(res.data, ["sortTitle", "title"], ["asc", "asc"])
          ),
        api.get("/sonarr/v3/queue/details?all=true").then((res) => res.data),
      ]).then(([series, queue]) => {
        const seriesInQueue = queue.map((it: any) => it.seriesId);

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
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {($movies.data || []).map((item) => {
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
                item.downloading
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
