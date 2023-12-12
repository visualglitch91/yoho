import { ComponentOverride } from "../utils";

const MuiInputLabel: ComponentOverride["MuiInputLabel"] = {
  styleOverrides: {
    root: {
      position: "static",
      transform: "unset",
      maxWidth: "unset",
      lineHeight: "unset",
    },
  },
  defaultProps: {
    disableAnimation: true,
  },
};

export default MuiInputLabel;
