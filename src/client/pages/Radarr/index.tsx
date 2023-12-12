import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import AppBar from "$common/Layout/AppBar";
import MediaItem from "$common/MediaItem";
import { api } from "$common/utils";

export default function Radarr() {
  const $movies = useQuery({
    queryKey: ["Radarr", "Movies"],
    queryFn: () => {
      return Promise.all([
        api
          .get("/radarr/v3/movie")
          .then((res) =>
            orderBy(res.data, ["sortTitle", "title"], ["asc", "asc"])
          ),
        api.get("/radarr/v3/queue/details?all=true").then((res) => res.data),
      ]).then(([movies, queue]) => {
        const moviesInQueue = queue.map((it: any) => it.movieId);

        return movies.map((it) => ({
          ...it,
          downloading: moviesInQueue.includes(it.id),
        }));
      }) as Promise<
        {
          id: string;
          title: string;
          downloading: boolean;
          hasFile: boolean;
          images: {
            coverType: string;
            remoteUrl: string;
          }[];
        }[]
      >;
    },
  });

  return (
    <>
      <AppBar title="Radarr" />
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {($movies.data || []).map((item) => (
          <MediaItem
            key={item.id}
            poster={
              item.images.find((it) => it.coverType === "poster")?.remoteUrl ||
              ""
            }
            title={item.title}
            color={
              item.hasFile ? "success" : item.downloading ? "primary" : "error"
            }
          />
        ))}
      </Box>
    </>
  );
}
