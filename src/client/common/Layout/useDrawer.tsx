import * as React from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { Drawer, DrawerHeader } from "./styled";
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
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        zIndex: 1,
        "& > .MuiPaper-root": { borderRight: 0, background: "transparent" },
      }}
    >
      <DrawerHeader />
      <List component="div" sx={{ p: 1 }}>
        {menu.map((item, index) => (
          <Link key={index} to={item.to}>
            <ListItem
              disablePadding
              component="a"
              sx={{
                borderRadius: "4px",
                overflow: "hidden",
                display: "block",
                color: "unset",
                mb: 1,
                backgroundColor: location.startsWith(item.to)
                  ? "#463f51"
                  : undefined,
              }}
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
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  );

  const drawerHeader = <DrawerHeader />;

  return {
    isOpen: open,
    openDrawer,
    closeDrawer,
    toggleDrawer,
    drawer,
    drawerHeader,
  };
}
