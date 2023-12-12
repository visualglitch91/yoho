import useModal from "./useModal";
import ConfirmDialog, { ConfirmConfigProps } from "$common/ConfirmDialog";

export type useConfirmConfig = Pick<
  ConfirmConfigProps,
  | "title"
  | "description"
  | "color"
  | "confirmLabel"
  | "cancelLabel"
  | "extraButtons"
  | "onConfirm"
>;

export default function useConfirm() {
  const mount = useModal();

  return function confirm(confirmProps: useConfirmConfig) {
    return mount((dialogProps) => (
      <ConfirmDialog {...confirmProps} {...dialogProps} />
    ));
  };
}
