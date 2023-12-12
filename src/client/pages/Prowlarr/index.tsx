import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Button,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import CenteredMessage from "$common/CenteredMessage";
import AppBar from "$common/Layout/AppBar";
import { api } from "$common/utils";
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
      <Stack
        direction="row"
        spacing={2}
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (search === e.currentTarget.search.value) {
            $results.refetch();
          } else {
            setSearch(e.currentTarget.search.value);
          }
        }}
      >
        <OutlinedInput
          fullWidth
          placeholder="Search"
          size="small"
          name="search"
          startAdornment={
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          }
        />
        <Button variant="outlined" size="small" type="submit">
          Search
        </Button>
      </Stack>
      {search ? (
        $results.isFetching ? (
          <CenteredMessage>
            <CircularProgress color="primary" />
          </CenteredMessage>
        ) : (
          <ResultsTable data={$results.data || []} />
        )
      ) : (
        <CenteredMessage>Torrent Search</CenteredMessage>
      )}
    </>
  );
}
