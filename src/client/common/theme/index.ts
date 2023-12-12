import { times } from "lodash";
import { createTheme, ThemeOptions } from "@mui/material";

const draculaPalette = {
  darkPurple: "#BD93F9",
  purple: "#6272A4",
  pink: "#FF79C6",
  darkPink: "#FF5555",
  background: "#282a36",
  foreground: "#f8f8f2",
  comment: "#6272a4",
  selection: "#44475a",
  cyan: "#8BE9FD",
  green: "#50fa7b",
  orange: "#ffb86c",
  yellow: "#f1fa8c",
  red: "#FF5555",
};

function getModuleName(filePath: string) {
  return filePath.match(/\/([^/]+)\.ts$/)?.[1] || null;
}

// Load all overrides from folder dinamically
const overrides = Object.entries(
  import.meta.glob("./overrides/*.ts", { eager: true })
).reduce(
  //@ts-expect-error
  (acc, [key, { default: module }]) => ({
    ...acc,
    //@ts-expect-error
    [getModuleName(key)]: module,
  }),
  {}
) as {
  [key: string]: ThemeOptions["components"][];
};

const theme = createTheme({
  components: overrides,
  //@ts-expect-error
  shadows: times(25, () => "none"),
  palette: {
    mode: "dark",
    primary: {
      main: draculaPalette.pink,
    },
    secondary: {
      main: draculaPalette.purple,
    },
    background: {
      default: draculaPalette.background,
      paper: "#111217",
    },
    text: {
      primary: draculaPalette.foreground,
      secondary: draculaPalette.comment,
    },
    action: {
      active: draculaPalette.foreground,
    },
    error: {
      main: draculaPalette.red,
    },
    info: {
      main: draculaPalette.cyan,
    },
    success: {
      main: draculaPalette.green,
    },
    warning: {
      main: draculaPalette.orange,
    },
  },
});

export default theme;
