import { useState } from "react";
import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import useModal from "$common/hooks/useModal";
import { api } from "$common/utils";
import CenteredMessage from "$common/CenteredMessage";
import SearchBar from "$common/SearchBar";
import PageLayout from "$common/PageLayout";
import { Movie } from "./types";
import MovieDialog from "./MovieDialog";
import MovieTable from "./MovieTable";

export default function Radarr() {
  const mount = useModal();
  const [search, setSearch] = useState("");

  const $movies = useQuery({
    queryKey: ["Radarr", "Movies", search],
    queryFn: () => {
      return Promise.all([
        api
          .get(
            search
              ? `/radarr/v3/movie/lookup?term=${search}`
              : "/radarr/v3/movie"
          )
          .then((res) =>
            orderBy(res.data, ["sortTitle", "title"], ["asc", "asc"]).filter(
              (it) =>
                it.runtime !== 0 && it.images.length > 0 && it.studio !== ""
            )
          ),
        api.get("/radarr/v3/queue/details?all=true").then((res) => res.data),
      ]).then(([movies, queue]) => {
        const moviesInQueue = queue
          .map((it: any) => it.movieId)
          .filter(Boolean);

        return movies.map((it) => ({
          ...it,
          downloading: moviesInQueue.includes(it.id),
        }));
      }) as Promise<Movie[]>;
    },
    refetchInterval: search ? 0 : 10_000,
  });

  return (
    <PageLayout
      title="Movies"
      header={
        <SearchBar
          onSearch={(term) => {
            if (search === term) {
              $movies.refetch();
            } else {
              setSearch(term);
            }
          }}
        />
      }
    >
      {$movies.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <MovieTable
          movies={$movies.data || []}
          onSelect={(movie) =>
            mount((props) => (
              <MovieDialog
                {...props}
                movie={movie}
                requestRefetch={$movies.refetch}
              />
            ))
          }
        />
      )}
    </PageLayout>
  );
}
