import { Button } from "@mui/material";
import StandardDialog, { StandardDialogProps } from "$common/StandardDialog";
import useConfirm from "$common/hooks/useConfirm";
import { api } from "$common/utils";
import SelectField from "$common/SelectField";
import useQualityProfiles from "./useQualityProfiles";
import { Movie } from "./types";
import { useState } from "react";

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
  const qualityProfiles = useQualityProfiles();

  const [qualityProfileId, setQualityProfileId] = useState(
    String(movie.qualityProfileId)
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
    api
      .put(`/radarr/v3/movie/${movie.id}`, {
        ...movie,
        qualityProfileId: Number(qualityProfileId),
      })
      .then(() => requestRefetch())
      .then(() => dialogProps.onClose("closeButton"));
  };

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
          <Button variant="outlined" onClick={onUpdate}>
            Save Changes
          </Button>
        </>
      }
    >
      <SelectField
        size="small"
        label="Quality Profile"
        value={String(qualityProfileId)}
        options={(qualityProfiles || []).map((it) => ({
          value: String(it.id),
          label: it.name,
        }))}
        onChange={(_, __, value) => setQualityProfileId(value || "")}
      />
    </StandardDialog>
  );
}
