import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ModalProvider } from "$common/hooks/useModal";
import theme from "$common/theme";
import YoHo from "./YoHo";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ModalProvider>
          <YoHo />
        </ModalProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
