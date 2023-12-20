import { Box, Paper, styled } from "@mui/material";
import useDrawer, { useDrawerProps } from "./useDrawer";

const PaddedContent = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    padding: theme.spacing(6, 3),
  },
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

const Page = styled(Paper)(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  [theme.breakpoints.down("md")]: { borderRadius: 0 },
}));

export default function Layout({
  menu,
  children,
}: useDrawerProps & {
  children: React.ReactNode;
}) {
  const { drawer, mobileDrawer } = useDrawer({ menu });

  return (
    <>
      {mobileDrawer}
      <Box
        sx={{ height: "100vh", display: "flex", maxWidth: 1600, mx: "auto" }}
      >
        <Box
          display={{ xs: "none", md: "block" }}
          width={{ lg: 280, xl: 340 }}
          flexShrink={0}
        >
          <Box position="sticky" top={0} maxHeight="100vh" overflow="auto">
            <PaddedContent>{drawer}</PaddedContent>
          </Box>
        </Box>
        <Box flexGrow={1} display="flex">
          <PageWrapper>
            <Page>{children}</Page>
          </PageWrapper>
        </Box>
      </Box>
    </>
  );
}
