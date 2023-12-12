import { Box } from "@mui/material";

export default function CenteredMessage({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
}
