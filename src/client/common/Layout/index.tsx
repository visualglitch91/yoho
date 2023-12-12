import { Box, AppBar, Toolbar, IconButton } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material/";
import useDrawer, { useDrawerProps } from "./useDrawer";
import { PORTAL_ID } from "./AppBar";

export default function Layout({
  menu,
  children,
}: useDrawerProps & {
  children: React.ReactNode;
}) {
  const { toggleDrawer, drawer, drawerHeader } = useDrawer({
    menu,
  });

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ zIndex: 2, backgroundColor: "#020202", px: "7px" }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer}
            edge="start"
            sx={{ mr: "30px" }}
          >
            <MenuIcon />
          </IconButton>
          <div id={PORTAL_ID} />
        </Toolbar>
      </AppBar>
      {drawer}
      <Box
        sx={{
          minHeight: "100vh",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {drawerHeader}
        <Box
          component="main"
          sx={{
            p: 1,
            flexGrow: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            component="main"
            sx={{
              p: 2,
              flexGrow: 1,
              position: "relative",
              display: "flex",
              flexDirection: "column",
              background: "#111017",
              borderRadius: "4px",
            }}
          >
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
