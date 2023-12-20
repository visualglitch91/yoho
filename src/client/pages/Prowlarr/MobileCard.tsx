import { Stack, styled } from "@mui/material";
import { humanizeBytes } from "$common/utils";
import { Torrent } from "./types";
import DownloadButton from "./DownloadButton";

const Title = styled("a")({
  fontSize: 14,
  whiteSpace: "normal",
});

const Subtitle = styled("span")({
  fontSize: 12,
});

export default function MobileCard({ torrent }: { torrent: Torrent }) {
  return (
    <Stack
      spacing={2}
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ flexGrow: 1, px: 2 }}
    >
      <Stack spacing={1} alignItems="flex-start" sx={{ overflow: "hidden" }}>
        <Title href={torrent.guid} target="_blank" style={{ color: "inherit" }}>
          {torrent.title}
        </Title>
        <Subtitle>
          {[
            torrent.indexer,
            humanizeBytes(torrent.size),
            `${torrent.seeders} / ${torrent.leechers}`,
          ].join(" • ")}
        </Subtitle>
        <Subtitle>
          {[
            `${torrent.age} days`,
            torrent.categories
              .map((it) => it.name)
              .filter(Boolean)
              .join(", "),
          ].join(" • ")}
        </Subtitle>
      </Stack>
      <DownloadButton torrent={torrent} />
    </Stack>
  );
}
