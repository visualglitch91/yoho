import { useState } from "react";
import { keyBy, orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import { api } from "$common/utils";
import SearchBar from "$common/SearchBar";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import ShowsTable from "./ShowsTable";
import { Show } from "./types";

export default function Sonarr() {
  const [search, setSearch] = useState("");

  const $series = useQuery<Show[]>({
    queryKey: ["Sonarr", "Series", search],
    queryFn: async () => {
      const currentSeries = await api
        .get("/sonarr/v3/series")
        .then((res) => res.data);

      const downloadQueue = await api
        .get("/sonarr/v3/queue/details?all=true")
        .then((res) => res.data.map((it: any) => it.seriesId).filter(Boolean));

      const series = search
        ? await api
            .get(`/sonarr/v3/series/lookup?term=${search}`)
            .then((res) => {
              const currentSeriesMap = keyBy(currentSeries, "tvdbId");

              return res.data.map((it: any) => ({
                ...it,
                statistics:
                  currentSeriesMap[it.tvdbId]?.statistics || it.statistics,
              }));
            })
        : currentSeries;

      return series.map((it: any) => ({
        ...it,
        downloading: downloadQueue.includes(it.id),
      }));
    },
  });

  return (
    <PageLayout
      title="TV Shows"
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
