import * as React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Link, useLocation } from "wouter";

export interface useDrawerProps {
  menu: { icon: React.ReactNode; title: string; to: string }[];
}

export default function useDrawer({ menu }: useDrawerProps) {
  const [open, setOpen] = React.useState(false);
  const [location] = useLocation();

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const toggleDrawer = () => {
    setOpen((x) => !x);
  };

  const drawer = (
    // <Drawer
    //   variant="permanent"
    //   open={open}
    //   sx={{
    //     zIndex: 1,
    //     "& > .MuiPaper-root": { borderRight: 0, background: "transparent" },
    //   }}
    // >
    //   <DrawerHeader />
    <List component="div" sx={{ p: 0 }}>
      {menu.map((item, index) => (
        <Link key={index} to={item.to}>
          <ListItem
            disablePadding
            component="a"
            sx={(theme) => ({
              borderRadius: `${theme.shape.borderRadius}px`,
              overflow: "hidden",
              display: "block",
              color: "white",
              mb: 1,
              backgroundColor: location.startsWith(item.to)
                ? theme.palette.primary.dark
                : undefined,
            })}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  mr: 2,
                  minWidth: 0,
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
    </List>
    // </Drawer>
  );

  // const drawerHeader = <DrawerHeader />;

  return {
    isOpen: open,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    drawer,
    // drawerHeader,
  };
}
