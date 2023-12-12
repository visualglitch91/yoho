import { ComponentOverride } from "../utils";

const MuiInputBase: ComponentOverride["MuiInputBase"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      fontSize: theme.typography.fontSize,
    }),
    input: {
      height: "unset",
    },
  },
  defaultProps: {
    size: "small",
  },
};

export default MuiInputBase;
