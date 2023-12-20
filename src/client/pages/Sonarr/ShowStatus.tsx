import { Chip } from "@mui/material";
import { Show } from "./types";

function getPercent(show: Show) {
  return show.statistics.episodeCount === 0
    ? 100
    : (show.statistics.episodeFileCount / show.statistics.episodeCount) * 100;
}

export default function ShowStatus({ show: row }: { show: Show }) {
  const percent = getPercent(row);

  return (
    <Chip
      size="small"
      sx={{ fontSize: 11, fontWeight: 600 }}
      color={
        !row.path
          ? "warning"
          : row.downloading
          ? "primary"
          : percent === 100
          ? "success"
          : percent > 0
          ? "info"
          : "error"
      }
      label={
        !row.path
          ? "Unmonitored"
          : row.downloading
          ? "Downloading"
          : percent === 100
          ? "All Available"
          : percent > 0
          ? "Some Available"
          : "Unavailable"
      }
    />
  );
}
