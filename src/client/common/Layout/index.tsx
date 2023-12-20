import { Box, Container, Paper, styled } from "@mui/material";
import useDrawer, { useDrawerProps } from "./useDrawer";

const PaddedContent = styled(Box)(({ theme }) => ({
  padding: theme.spacing(6, 3),
}));

const PageContent = styled(Box)({
  position: "relative",
  overflow: "auto",
  display: "flex",
  flexDirection: "column",
  zIndex: 1,
  flexGrow: 1,
});

export const PaddedPageContent = styled(PageContent)(({ theme }) => ({
  padding: theme.spacing(4, 6),
  flexGrow: 1,
}));

const PageWrapper = styled(PaddedContent)({
  flexGrow: 1,
  display: "flex",
  overflow: "hidden",
});

const Page = styled(Paper)({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

export default function Layout({
  menu,
  children,
}: useDrawerProps & {
  children: React.ReactNode;
}) {
  const { drawer } = useDrawer({ menu });

  return (
    <Container maxWidth="xl" sx={{ height: "100vh", display: "flex" }}>
      <Box width={340} flexShrink={0}>
        <Box position="sticky" top={0} maxHeight="100vh" overflow="auto">
          <PaddedContent>{drawer}</PaddedContent>
        </Box>
      </Box>
      <Box flexGrow={1} display="flex">
        <PageWrapper>
          <Page>{children}</Page>
        </PageWrapper>
      </Box>
    </Container>
  );
}
