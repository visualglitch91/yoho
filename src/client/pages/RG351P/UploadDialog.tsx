import { useEffect, useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import { api } from "$common/utils";
import StandardDialog, { StandardDialogProps } from "$common/StandardDialog";
import SelectField from "$common/SelectField";
import { Platform } from "./types";

async function uploadGame(name: string, platform: string, file: File) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("file", file);

  try {
    const response = await api.post(
      `/rg351p/platform/${platform}/games`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    return response;
  } catch (error) {
    // Handle error
    throw new Error("Error uploading game: " + error);
  }
}

function stripFileExtension(filename: string) {
  const lastDotIndex = filename.lastIndexOf(".");
  if (lastDotIndex === -1) {
    // If there's no dot in the filename, return the original filename
    return filename;
  } else {
    // Return the filename without the extension
    return filename.substring(0, lastDotIndex);
  }
}

export default function UploadDialog({
  platforms,
  defaultPlatform,
  onClose,
  onUpload,
  ...props
}: {
  platforms: Platform[];
  defaultPlatform?: string;
  onUpload: () => void;
} & Omit<StandardDialogProps, "title" | "children">) {
  const [file, setFile] = useState<File>();
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState(defaultPlatform || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (file) {
      setName(stripFileExtension(file.name));
    }
  }, [file]);

  return (
    <StandardDialog
      {...props}
      sx={{
        "& .MuiDialogContent-root": {
          minWidth: { xs: "80vw", md: "600px" },
        },
      }}
      maxWidth={false}
      onClose={onClose}
      title="Upload ROM"
      component="form"
      footer={
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
        >
          Upload
        </Button>
      }
      onSubmit={(event) => {
        event.preventDefault();

        if (loading || !name || !platform || !file) {
          return;
        }

        setLoading(true);
        uploadGame(name, platform, file).then(
          () => {
            setLoading(false);
            onUpload();
            onClose("closeButton");
          },
          (err) => {
            setLoading(false);
            console.log(err);
          }
        );
      }}
    >
      <Stack spacing={2}>
        <TextField
          type="file"
          name="file"
          label="File"
          fullWidth
          onChange={(event: any) => {
            const file = event.target.files?.[0];

            if (file) {
              setFile(file);
            }
          }}
        />
        <TextField
          name="gameName"
          label="Name"
          fullWidth
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <SelectField
          name="platform"
          label="Platform"
          fullWidth
          value={platform}
          onChange={(event) => setPlatform(event.target.value)}
          options={platforms.map((it) => ({
            label: it.name,
            value: it.name,
          }))}
        />
      </Stack>
    </StandardDialog>
  );
}
