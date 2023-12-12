import { CircularProgress, IconButton } from "@mui/material";
import { Check, CloudDownload, ErrorOutline } from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import { api } from "$common/utils";
import { Torrent } from "./types";

export default function DownloadButton({ torrent }: { torrent: Torrent }) {
  const $$download = useMutation({
    mutationFn: () => {
      return api.post("/prowlarr/v1/search", torrent);
    },
  });

  if ($$download.isPending) {
    return <CircularProgress size={24} />;
  }

  const isSettled = $$download.isSuccess || $$download.isError;

  return (
    <IconButton
      disabled={$$download.isPending}
      onClick={isSettled ? undefined : () => $$download.mutate()}
    >
      {$$download.isSuccess ? (
        <Check />
      ) : $$download.isError ? (
        <ErrorOutline />
      ) : (
        <CloudDownload />
      )}
    </IconButton>
  );
}
