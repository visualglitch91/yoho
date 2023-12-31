import {
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
} from "@mui/material";
import FieldBase, { FieldBaseProps } from "../FieldBase";
import { generateFieldBaseIds } from "../FieldBase/utils";

interface SelectOption<T extends string | number> {
  label: string;
  value: T;
  hidden?: boolean;
  disabled?: boolean;
}

export default function SelectField<T extends string | number>({
  id,
  label,
  options,
  fullWidth,
  helperText,
  error,
  onChange,
  sx,
  className,
  size,
  ...props
}: Omit<SelectProps<T>, "labelId" | "children" | "onChange"> &
  FieldBaseProps & {
    options: readonly SelectOption<T>[];
    onChange?: (
      event: SelectChangeEvent<T>,
      child: React.ReactNode,
      value: T | null
    ) => void;
  }) {
  const fieldBaseIds = generateFieldBaseIds(id);

  return (
    <FieldBase
      {...fieldBaseIds}
      size={size}
      sx={sx}
      className={className}
      fullWidth={fullWidth}
      label={label}
      error={error}
      helperText={helperText}
    >
      <Select
        {...props}
        onChange={
          onChange
            ? (event, node) => {
                onChange?.(event, node, event.target.value as T | null);
              }
            : undefined
        }
        error={error}
        labelId={fieldBaseIds.labelId}
        id={id}
      >
        {options.map((it) =>
          it.hidden ? null : (
            <MenuItem key={it.value} value={it.value} disabled={it.disabled}>
              {it.label}
            </MenuItem>
          )
        )}
      </Select>
    </FieldBase>
  );
}
