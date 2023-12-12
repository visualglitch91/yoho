import {
  Fab,
  List,
  Stack,
  Alert,
  Button,
  ListItem,
  Snackbar,
  Checkbox,
  IconButton,
  ListItemIcon,
  ListItemText,
  LinearProgress,
} from "@mui/material";
import {
  HighlightOff as RemoveIcon,
  PlayCircleOutline as PlayIcon,
  PauseCircleOutline as PauseIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { humanizeBytes, round } from "$common/utils";
import humanizeDuration from "humanize-duration";
import { formatProgress } from "./utils";
import useConfirm from "$common/hooks/useConfirm";
import { useState } from "react";
import CenteredMessage from "$common/CenteredMessage";

export interface Download {
  id: string;
  name: string;
  eta: number;
  status:
    | "downloading"
    | "uploading"
    | "processing"
    | "queued"
    | "stopped"
    | "error";
  statusInfo: string;
  progress: number;
  completed: boolean;
  total: number;
  downloadRate: number;
}

export default function DownloadList({
  downloads,
  onAdd,
  onStart,
  onStop,
  onRemove,
}: {
  downloads: Download[];
  onAdd: () => void;
  onStart?: (downloads: Download[]) => void;
  onStop?: (downloads: Download[]) => void;
  onRemove: (downloads: Download[], deleteData: boolean) => void;
}) {
  const confirm = useConfirm();
  const canStartStop = Boolean(onStart && onStop);
  const [selected, setSelected] = useState<string[]>([]);

  const getSelectedDownloads = () => {
    return downloads.filter((it) => selected.includes(it.id));
  };

  const confirmRemove = (downloads: Download[]) => {
    confirm({
      title: "Remove downloads",
      description: "Are you sure you want to remove these downloads?",
      color: "error",
      extraButtons: {
        "delete-data": {
          label: "Delete download and data",
          variant: "contained",
        },
      },
      confirmLabel: "Delete download only",
      onConfirm: (key) => onRemove(downloads, key === "delete-data"),
    });
  };

  const onSelectedStart = () => {
    onStart!(getSelectedDownloads());
  };

  const onSelectedStop = () => {
    onStop!(getSelectedDownloads());
  };

  const onSelectedRemove = () => {
    confirmRemove(getSelectedDownloads());
    setSelected([]);
  };

  return (
    <>
      <Fab
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        color="primary"
        onClick={onAdd}
      >
        <AddIcon />
      </Fab>
      <Snackbar sx={{ width: "calc(100% - 48px)" }} open={selected.length > 0}>
        <Alert
          sx={{ width: "100%" }}
          icon={false}
          variant="filled"
          severity="info"
          action={
            <>
              {canStartStop && (
                <>
                  <Button
                    color="inherit"
                    size="small"
                    onClick={onSelectedStart}
                  >
                    Start
                  </Button>
                  <Button color="inherit" size="small" onClick={onSelectedStop}>
                    Stop
                  </Button>
                </>
              )}
              <Button color="inherit" size="small" onClick={onSelectedRemove}>
                Remove
              </Button>
            </>
          }
        >
          {`${selected.length} download(s) selected`}
        </Alert>
      </Snackbar>
      {downloads.length === 0 ? (
        <CenteredMessage>No downloads found</CenteredMessage>
      ) : (
        <List sx={{ width: "100%" }}>
          {downloads.map((download) => {
            const labelId = `checkbox-list-label-${download.id}`;

            return (
              <ListItem
                dense
                disablePadding
                key={download.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => confirmRemove([download])}
                  >
                    <RemoveIcon />
                  </IconButton>
                }
              >
                <ListItemIcon sx={canStartStop ? { minWidth: 0 } : undefined}>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(download.id)}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ "aria-labelledby": labelId }}
                    onChange={(_, checked) =>
                      setSelected(
                        checked
                          ? selected.concat(download.id)
                          : selected.filter((it) => it !== download.id)
                      )
                    }
                  />
                </ListItemIcon>
                {canStartStop && (
                  <ListItemIcon>
                    {download.status === "stopped" ? (
                      <IconButton
                        edge="end"
                        onClick={() => onStart!([download])}
                      >
                        <PlayIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        edge="end"
                        onClick={() => onStop!([download])}
                      >
                        <PauseIcon />
                      </IconButton>
                    )}
                  </ListItemIcon>
                )}
                <ListItemText
                  id={labelId}
                  primary={download.name}
                  secondary={
                    <Stack spacing={0.5}>
                      <div>
                        {[
                          download.statusInfo,
                          download.status === "downloading"
                            ? `${humanizeBytes(download.downloadRate)}/s`
                            : false,
                          download.status === "downloading"
                            ? download.eta > 1
                              ? humanizeDuration(download.eta * 1000, {
                                  round: true,
                                  largest: 2,
                                })
                              : "∞"
                            : false,
                          download.total > 0
                            ? formatProgress(download.total, download.progress)
                            : false,
                          download.progress > 0
                            ? round(download.progress * 100, 2) + "%"
                            : false,
                        ]
                          .filter((it) => it !== false)
                          .join(" • ")}
                      </div>
                      <LinearProgress
                        variant="determinate"
                        color={
                          download.status === "error"
                            ? "error"
                            : download.completed
                            ? "info"
                            : "primary"
                        }
                        value={
                          download.status === "error"
                            ? 100
                            : download.progress * 100
                        }
                      />
                    </Stack>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      )}
    </>
  );
}
