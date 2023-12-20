import { Menu as MenuIcon } from "@mui/icons-material";
import { Box, IconButton, Stack, Typography, styled } from "@mui/material";
import { toggleDrawerRef } from "$common/Layout/useDrawer";
import useIsMobile from "$common/hooks/usIsMobile";

const PageHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  boxShadow: "0px 10px 13px 0px rgba(20,20,20,0.2)",
  zIndex: 2,
  padding: theme.spacing(2),
  [theme.breakpoints.up("md")]: { padding: theme.spacing(4, 6) },
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

export default function PageLayout({
  title,
  actions,
  header,
  children,
  disableHeaderSpacing,
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
  disableHeaderSpacing?: boolean;
}) {
  const isMobile = useIsMobile();

  const actionsElement = actions ? (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1}
      sx={{ "&, & > *": { flexShrink: 0 } }}
    >
      {actions}
    </Stack>
  ) : null;

  return (
    <>
      <PageHeader>
        <Stack direction="row" alignItems="center" spacing={2}>
          {isMobile && (
            <IconButton onClick={() => toggleDrawerRef.current()}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: 18, md: 28 },
            }}
          >
            {title}
          </Typography>
          {!isMobile && actionsElement}
        </Stack>
        <Stack
          spacing={disableHeaderSpacing ? 0 : { xs: 1, md: 2 }}
          mt={disableHeaderSpacing ? 0 : { xs: 1, md: 2 }}
          sx={{ "&:empty": { display: "none" } }}
        >
          {isMobile && actionsElement}
          {header}
        </Stack>
      </PageHeader>
      <PageContent>{children}</PageContent>
    </>
  );
}
