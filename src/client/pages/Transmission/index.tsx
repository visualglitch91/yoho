import { orderBy } from "lodash";
import { Box, Button, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { api, wait } from "$common/utils";
import DownloadList, { Download } from "$common/DownloadList";
import { usePrompt } from "$common/hooks/usePrompt";
import CenteredMessage from "$common/CenteredMessage";
import PageLayout from "$common/PageLayout";
import { Add } from "@mui/icons-material";

const fallbackStatus = {
  status: "processing",
  info: "Unknown",
};

const statusMap: Record<
  number,
  {
    status: Download["status"];
    info: string;
  }
> = {
  0: { status: "stopped", info: "Stopped" },
  1: { status: "queued", info: "Queued to verify" },
  2: { status: "processing", info: "Verifying" },
  3: { status: "queued", info: "Queued" },
  4: { status: "downloading", info: "Downloading" },
  5: { status: "queued", info: "Queued to seed" },
  6: { status: "uploading", info: "Seeding" },
};

export default function Transmission() {
  const prompt = usePrompt();

  const $torrents = useQuery({
    queryKey: ["Transmission", "Torrents"],
    queryFn: () =>
      api
        .get<
          {
            eta: number;
            id: number;
            name: string;
            percentDone: number;
            status: number;
            sizeWhenDone: number;
            rateDownload: number;
          }[]
        >("/transmission/downloads")
        .then((res) => orderBy(res.data, ["queuePosition"], ["asc"])),
    refetchInterval: 3_000,
  });

  const onStart = (downloads: Download[]) => {
    api
      .post("/transmission/start", {
        ids: downloads.map((it) => it.id),
      })
      .then(() => wait(500))
      .then(() => $torrents.refetch());
  };

  const onStop = (downloads: Download[]) => {
    api
      .post("/transmission/stop", {
        ids: downloads.map((it) => it.id),
      })
      .then(() => wait(500))
      .then(() => $torrents.refetch());
  };

  const onRemove = (downloads: Download[], deleteData: boolean) => {
    api
      .post("/transmission/delete", {
        ids: downloads.map((it) => it.id),
        deleteData,
      })
      .then(() => wait(500))
      .then(() => $torrents.refetch());
  };

  const onAdd = () => {
    prompt({
      title: "Add new torrent",
      fields: ["Magnet URI"],
      onConfirm: ([magnet]) => {
        api
          .post("/transmission/add", { magnet })
          .then(() => wait(500))
          .then(() => $torrents.refetch());
      },
    });
  };

  return (
    <PageLayout
      title="Transmission"
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
          id="transmission__selection-alert"
        />
      }
    >
      {typeof $torrents.data === "undefined" ? (
        <CenteredMessage>
          <CircularProgress color="primary" />
        </CenteredMessage>
      ) : (
        <DownloadList
          downloads={$torrents.data.map((it) => ({
            id: String(it.id),
            eta: it.eta,
            name: it.name,
            progress: it.percentDone,
            status: statusMap[it.status]?.status ?? fallbackStatus.status,
            statusInfo: statusMap[it.status]?.info ?? fallbackStatus.info,
            completed: it.percentDone === 1,
            total: it.sizeWhenDone,
            downloadRate: Math.max(0, it.rateDownload),
          }))}
          selectionAlertPortalId="transmission__selection-alert"
          onStart={onStart}
          onStop={onStop}
          onRemove={onRemove}
        />
      )}
    </PageLayout>
  );
}
