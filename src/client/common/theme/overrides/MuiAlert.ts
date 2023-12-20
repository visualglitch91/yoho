import { ComponentOverride } from "../utils";

const MuiAlert: ComponentOverride["MuiAlert"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
    }),
  },
};

export default MuiAlert;
