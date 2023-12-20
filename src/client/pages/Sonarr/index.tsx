import { useState } from "react";
import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { api } from "$common/utils";
import { CircularProgress } from "@mui/material";
import SearchBar from "$common/SearchBar";
import CenteredMessage from "$common/CenteredMessage";
import ShowsTable from "./ShowsTable";
import PageLayout from "$common/PageLayout";

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
    <PageLayout
      title="Sonarr"
      header={
        <SearchBar
          onSearch={(term) => {
            if (search === term) {
              $series.refetch();
            } else {
              setSearch(term);
            }
          }}
        />
      }
    >
      {$series.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <ShowsTable shows={$series.data || []} onSelect={console.log} />
      )}
    </PageLayout>
  );
}
