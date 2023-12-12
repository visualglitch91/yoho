import { useState } from "react";
import { Button, TextField, Stack } from "@mui/material";
import StandardDialog, { StandardDialogProps } from "$common/StandardDialog";

export default function PromptDialog({
  title,
  fields,
  onConfirm,
  ...props
}: {
  title: string;
  fields: string[];
  onConfirm: (values: string[]) => void;
} & StandardDialogProps) {
  const [values, setValues] = useState(() => fields.map(() => ""));

  return (
    <StandardDialog
      title={title}
      {...props}
      footer={
        <Button
          color="primary"
          variant="contained"
          onClick={() => onConfirm(values)}
        >
          Confirmar
        </Button>
      }
    >
      <Stack spacing={2} pt={1}>
        {fields.map((label, index) => (
          <TextField
            key={index}
            label={label}
            autoFocus={index === 0}
            value={values[index]}
            onChange={(event) => {
              const value = event.currentTarget.value;

              setValues((prev) => {
                const next = [...prev];
                next[index] = value;
                return next;
              });
            }}
          />
        ))}
      </Stack>
    </StandardDialog>
  );
}
