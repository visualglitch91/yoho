import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, GlobalStyles } from "@mui/material";
import { ModalProvider } from "$common/hooks/useModal";
import theme from "$common/theme";
import YoHo from "./YoHo";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={(theme) => ({
            body: {
              color: theme.palette.text.primary,
              background: theme.palette.background.default,
            },
            "body .MuiDataGrid-root": {
              border: 0,
              "--unstable_DataGrid-radius": 0,
              "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-cell:focus": {
                outline: "none",
              },
              ".MuiDataGrid-columnHeaders": {
                background: theme.palette.secondary.dark,
              },
            },
          })}
        />
        <ModalProvider>
          <YoHo />
        </ModalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
