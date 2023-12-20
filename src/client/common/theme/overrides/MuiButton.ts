import { ComponentOverride } from "../utils";

const MuiButton: ComponentOverride["MuiButton"] = {
  styleOverrides: {
    root: {
      minHeight: 38,
    },
    sizeSmall: {
      minHeight: 31,
    },
  },
};

export default MuiButton;
