import { useQuery } from "@tanstack/react-query";
import { Box, CircularProgress } from "@mui/material";
import AppBar from "$common/Layout/AppBar";
import { api } from "$common/utils";
import CenteredMessage from "$common/CenteredMessage";
import MediaItem from "$common/MediaItem";

export default function NSwitch() {
  const $games = useQuery({
    queryKey: ["Switch", "Games"],
    queryFn: () => {
      return api
        .get("/switch/games")
        .then(
          (res) => res.data as { image: string; href: string; title: string }[]
        );
    },
  });

  return (
    <>
      <AppBar title="Nintendo Switch" />

      {$games.isLoading ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <Box display="flex" flexWrap="wrap" gap={2}>
          {($games.data || []).map((item) => (
            <MediaItem
              key={item.href}
              width={150}
              height={150}
              percent={false}
              poster={item.image}
              title={item.title}
              onClick={() => window.open(item.href)}
            />
          ))}
        </Box>
      )}
    </>
  );
}
