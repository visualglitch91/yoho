import { ComponentOverride } from "../utils";

const MuiSelect: ComponentOverride["MuiSelect"] = {
  styleOverrides: {
    outlined: {
      minHeight: 18,
      paddingTop: 11,
      paddingBottom: 7,
    },
  },
};

export default MuiSelect;
