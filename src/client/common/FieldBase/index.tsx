import { InputLabel, FormControl, FormHelperText } from "@mui/material";
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
  children,
}: FieldBaseProps) {
  return (
    <FormControl sx={sx} className={className} fullWidth={fullWidth}>
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
