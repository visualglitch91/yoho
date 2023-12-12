import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress } from "@mui/material";
import CenteredMessage from "$common/CenteredMessage";
import AppBar from "$common/Layout/AppBar";
import { api } from "$common/utils";
import SearchBar from "$common/SearchBar";
import ResultsTable from "./ResultsTable";
import { Torrent } from "./types";

export default function Prowlarr() {
  const [search, setSearch] = useState("");

  const $results = useQuery({
    queryKey: ["Prowlarr", "Search", search],
    queryFn: () =>
      api
        .get<Torrent[]>(
          `/prowlarr/v1/search?query=${search}&type=search&offset=0&limit=150`
        )
        .then((res) => res.data),
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <AppBar title="Prowlarr" />

      <SearchBar
        onSearch={(term) => {
          if (search === term) {
            $results.refetch();
          } else {
            setSearch(term);
          }
        }}
      />

      {search ? (
        $results.isFetching ? (
          <CenteredMessage>
            <CircularProgress color="primary" />
          </CenteredMessage>
        ) : (
          <ResultsTable data={$results.data || []} />
        )
      ) : null}
    </>
  );
}
