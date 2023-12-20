import { orderBy } from "lodash";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, CircularProgress } from "@mui/material";
import { Add } from "@mui/icons-material";
import { api } from "$common/utils";
import DownloadList, { Download } from "$common/DownloadList";
import { usePrompt } from "$common/hooks/usePrompt";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";

export default function JDownloader() {
  const prompt = usePrompt();

  const $downloads = useQuery({
    queryKey: ["JDownloader", "Downloads"],
    queryFn: () =>
      api
        .get<
          {
            eta: number;
            uuid: number;
            name: string;
            bytesLoaded: number;
            status: string;
            bytesTotal: number;
            speed: number;
            availability: string;
            finished: boolean;
          }[]
        >("/jdownloader/downloads")
        .then((res) => orderBy(res.data, ["queuePosition"], ["asc"])),
    refetchInterval: 3_000,
  });

  const onRemove = (downloads: Download[], deleteData: boolean) => {
    api
      .post("/jdownloader/delete", {
        ids: downloads.map((it) => it.id),
        deleteData,
      })
      .then(() => $downloads.refetch());
  };

  const onAdd = () => {
    prompt({
      title: "Add new download",
      fields: ["Download URL"],
      onConfirm: ([url]) => {
        api.post("/jdownloader/add", { url }).then(() => $downloads.refetch());
      },
    });
  };

  return (
    <PageLayout
      title="JDownloader"
      actions={
        <Button startIcon={<Add />} variant="outlined" onClick={onAdd}>
          Add Torrent
        </Button>
      }
      header={
        <Box
          sx={(theme) => ({
            margin: theme.spacing(0, -6, -2),
            "& .MuiAlert-root": { borderRadius: 0 },
          })}
          id="jdownloader__selection-alert"
        />
      }
    >
      {typeof $downloads.data === "undefined" ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <DownloadList
          downloads={$downloads.data.map((it) => {
            const processing = Boolean(it.availability);
            const offline = it.availability === "OFFLINE";

            return {
              id: String(it.uuid),
              eta: it.eta,
              name: it.name,
              progress: processing ? -1 : it.bytesLoaded / it.bytesTotal,
              status: offline
                ? "error"
                : processing
                ? "processing"
                : it.finished
                ? "stopped"
                : "downloading",
              statusInfo: offline
                ? "Offline"
                : processing
                ? "Processing"
                : it.status,
              completed: it.finished,
              total: processing ? -1 : it.bytesTotal,
              downloadRate: Math.max(0, it.speed),
            };
          })}
          selectionAlertPortalId="jdownloader__selection-alert"
          onRemove={onRemove}
        />
      )}
    </PageLayout>
  );
}
