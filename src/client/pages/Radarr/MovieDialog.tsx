import { useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import StandardDialog, { StandardDialogProps } from "$common/StandardDialog";
import useConfirm from "$common/hooks/useConfirm";
import { api } from "$common/utils";
import SelectField from "$common/SelectField";
import { Movie } from "./types";
import useConfig from "./useConfig";

export default function MovieDialog({
  movie,
  requestRefetch,
  ...dialogProps
}: {
  movie: Movie;
  requestRefetch: () => Promise<any>;
} & Omit<
  StandardDialogProps,
  "title" | "children" | "footer" | "hideCloseButton" | "disableContentPadding"
>) {
  const confirm = useConfirm();
  const config = useConfig();

  const [form, setForm] = useState(
    movie.monitored
      ? {
          rootFolderPath: movie.rootFolderPath || "",
          qualityProfileId: String(movie.qualityProfileId || ""),
        }
      : undefined
  );

  const onDelete = () => {
    confirm({
      title: `Delete ${movie.title}`,
      description:
        "Are you sure you want to delete this movie and all its files?",
      onConfirm: () =>
        api
          .delete(
            `/radarr/v3/movie/${movie.id}?deleteFiles=true&addImportExclusion=false`
          )
          .then(() => requestRefetch())
          .then(() => dialogProps.onClose("closeButton")),
    });
  };

  const onUpdate = () => {
    if (!form) {
      return;
    }

    const promise = movie.monitored
      ? api.put(`/radarr/v3/movie/${movie.id}`, {
          ...movie,
          qualityProfileId: Number(form.qualityProfileId),
        })
      : api.post(`/radarr/v3/movie`, {
          ...movie,
          monitored: true,
          qualityProfileId: Number(form.qualityProfileId),
          rootFolderPath: form.rootFolderPath,
          addOptions: { monitor: "movieOnly", searchForMovie: true },
        });

    promise
      .then(() => requestRefetch())
      .then(() => dialogProps.onClose("closeButton"));
  };

  useEffect(() => {
    if (config && !form) {
      setForm({
        qualityProfileId: String(config.qualityProfiles[0].id),
        rootFolderPath: config.rootPaths[0],
      });
    }
  }, [config, form]);

  if (!config || !form) {
    return null;
  }

  return (
    <StandardDialog
      {...dialogProps}
      title={movie.title}
      sx={{ "& .MuiDialog-paper": { minWidth: 400 } }}
      footer={
        <>
          <Button variant="outlined" color="error" onClick={onDelete}>
            Delete
          </Button>
          <Button
            disabled={
              form.qualityProfileId === "" || form.rootFolderPath === ""
            }
            variant="outlined"
            onClick={onUpdate}
          >
            {movie.monitored ? "Save Changes" : "Add Movie"}
          </Button>
        </>
      }
    >
      <Stack spacing={2}>
        {!movie.monitored && (
          <SelectField
            size="small"
            label="Root Folder"
            value={form.rootFolderPath}
            options={config.rootPaths.map((it) => ({ value: it, label: it }))}
            onChange={(_, __, value) => {
              setForm({ ...form!, rootFolderPath: value || "" });
            }}
          />
        )}
        <SelectField
          size="small"
          label="Quality Profile"
          value={String(form.qualityProfileId)}
          options={config.qualityProfiles.map((it) => ({
            value: String(it.id),
            label: it.name,
          }))}
          onChange={(_, __, value) => {
            setForm({ ...form, qualityProfileId: value || "" });
          }}
        />
      </Stack>
    </StandardDialog>
  );
}
