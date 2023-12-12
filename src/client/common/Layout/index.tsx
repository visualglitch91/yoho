import {
  AppBarProps as MuiAppBarProps,
  styled,
  Box,
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material/";
import useDrawer, { useDrawerProps } from "./useDrawer";
import { PORTAL_ID } from "./AppBar";
import { DRAWER_WIDTH } from "./styled";

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<MuiAppBarProps & { open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function Layout({
  menu,
  children,
}: useDrawerProps & {
  children: React.ReactNode;
}) {
  const { isOpen, openDrawer, drawer, drawerHeader } = useDrawer({ menu });

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={isOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={openDrawer}
            edge="start"
            sx={{
              marginRight: 5,
              ...(isOpen && { display: "none" }),
            }}
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
            p: 3,
            flexGrow: 1,
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
