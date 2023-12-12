import { ComponentOverride } from "../utils";

const MuiInputLabel: ComponentOverride["MuiInputLabel"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      position: "static",
      transform: "unset",
      maxWidth: "unset",
      lineHeight: "unset",
    }),
  },
  defaultProps: {
    disableAnimation: true,
  },
};

export default MuiInputLabel;
