import { Box, Stack, Typography, styled } from "@mui/material";

const PageHeader = styled(Box)(({ theme }) => ({
  position: "relative",
  padding: theme.spacing(4, 6, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  flexShrink: 0,
  boxShadow: "0px 10px 13px 0px rgba(20,20,20,0.2)",
  zIndex: 2,
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
}: {
  title: React.ReactNode;
  actions?: React.ReactNode;
  header?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <>
      <PageHeader>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Typography variant="h4" noWrap component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          {actions && (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ "&, & > *": { flexShrink: 0 } }}
            >
              {actions}
            </Stack>
          )}
        </Stack>
        {header}
      </PageHeader>
      <PageContent>{children}</PageContent>
    </>
  );
}
