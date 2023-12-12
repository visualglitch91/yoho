import { Button, Typography, ButtonProps } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import StandardDialog, { StandardDialogProps } from "../StandardDialog";
import { map } from "lodash";

export interface ConfirmConfigProps extends StandardDialogProps {
  description?: string;
  color?: ButtonProps["color"];
  confirmLabel?: string;
  cancelLabel?: string;
  extraButtons?: {
    [key: string]: {
      label: string;
      variant?: ButtonProps["variant"];
    };
  };
  onConfirm: (key?: string) => void | Promise<any>;
}

export default function ConfirmDialog({
  title,
  color,
  cancelLabel = "Cancel",
  onConfirm,
  confirmLabel = "Continue",
  description,
  extraButtons,
  onClose,
  ...props
}: ConfirmConfigProps) {
  const { isPending, mutate } = useMutation({
    mutationFn: async (key?: string) => {
      await onConfirm(key);
    },
    onSuccess: () => onClose("closeButton"),
  });

  return (
    <StandardDialog
      {...props}
      hideCloseButton
      onClose={onClose}
      title={title}
      footer={
        <>
          <Button
            disabled={isPending}
            color={color}
            variant="outlined"
            onClick={() => onClose("closeButton")}
          >
            {cancelLabel}
          </Button>
          {map(extraButtons, ({ label, variant }, key) => (
            <Button
              key={key}
              disabled={isPending}
              color={color}
              variant={variant || "outlined"}
              onClick={() => mutate(key)}
            >
              {label}
            </Button>
          ))}
          <Button
            color={color}
            disabled={isPending}
            variant="contained"
            onClick={() => mutate(undefined)}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Typography variant="body2">{description}</Typography>
    </StandardDialog>
  );
}
