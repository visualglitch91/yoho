import { ComponentOverride } from "../utils";

const MuiAlert: ComponentOverride["MuiAlert"] = {
  styleOverrides: {
    root: ({ theme }) => ({
      color: theme.palette.text.primary,
    }),
    filledInfo: ({ theme }) => ({
      color: theme.palette.secondary.contrastText,
      background: theme.palette.secondary.dark,
    }),
  },
  defaultProps: {
    severity: "info",
    variant: "filled",
  },
};

export default MuiAlert;
