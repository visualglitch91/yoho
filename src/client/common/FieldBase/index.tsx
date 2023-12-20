import {
  InputLabel,
  FormControl,
  FormHelperText,
  FormControlProps,
} from "@mui/material";
import { SxProps } from "$common/theme/utils";

export interface FieldBaseProps {
  label?: string;
  labelId?: string;
  helperTextId?: string;
  helperText?: string;
  error?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
  sx?: SxProps;
  className?: string;
  size?: FormControlProps["size"];
}

export default function FieldBase({
  label,
  labelId,
  helperTextId,
  helperText,
  error,
  fullWidth = true,
  sx,
  className,
  size,
  children,
}: FieldBaseProps) {
  return (
    <FormControl
      sx={sx}
      size={size}
      className={className}
      fullWidth={fullWidth}
    >
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      {children}
      {helperText && (
        <FormHelperText id={helperTextId} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}
