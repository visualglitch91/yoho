import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { ModalProvider } from "$common/hooks/useModal";
import YoHo from "./YoHo";

const queryClient = new QueryClient();

const darkTheme = createTheme({
  palette: { mode: "dark" },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <ModalProvider>
          <YoHo />
        </ModalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
