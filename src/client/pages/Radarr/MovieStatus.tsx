import { Chip } from "@mui/material";
import { Movie } from "./types";

export default function MovieStatus({ movie }: { movie: Movie }) {
  return (
    <Chip
      size="small"
      sx={{ fontSize: 11, fontWeight: 600 }}
      color={
        !movie.monitored
          ? "warning"
          : movie.hasFile
          ? "success"
          : movie.downloading
          ? "primary"
          : "error"
      }
      label={
        !movie.monitored
          ? "Unmonitored"
          : movie.hasFile
          ? "Available"
          : movie.downloading
          ? "Downloading"
          : "Monitored"
      }
    />
  );
}
