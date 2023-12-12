export function generateFieldBaseIds(inputId?: string) {
  return {
    labelId: inputId ? `${inputId}__label` : undefined,
    helperTextId: inputId ? `${inputId}__helper-text` : undefined,
  };
}
