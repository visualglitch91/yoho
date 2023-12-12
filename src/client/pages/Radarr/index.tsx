import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { Box } from "@mui/material";
import AppBar from "$common/Layout/AppBar";
import MediaItem from "$common/MediaItem";
import useModal from "$common/hooks/useModal";
import { api } from "$common/utils";
import { Movie } from "./types";
import MovieDialog from "./MovieDialog";

export default function Radarr() {
  const mount = useModal();
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
      }) as Promise<Movie[]>;
    },
  });

  return (
    <>
      <AppBar title="Radarr" />
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {($movies.data || []).map((movie) => (
          <MediaItem
            key={movie.id}
            poster={
              movie.images.find((it) => it.coverType === "poster")?.remoteUrl ||
              ""
            }
            title={movie.title}
            color={
              movie.hasFile
                ? "success"
                : movie.downloading
                ? "primary"
                : "error"
            }
            onClick={() =>
              mount((props) => (
                <MovieDialog
                  {...props}
                  movie={movie}
                  requestRefetch={$movies.refetch}
                />
              ))
            }
          />
        ))}
      </Box>
    </>
  );
}
