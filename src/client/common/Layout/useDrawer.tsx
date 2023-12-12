import * as React from "react";
import {
  List,
  Divider,
  useTheme,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material/";
import { Drawer, DrawerHeader } from "./styled";
import { Link } from "wouter";

export interface useDrawerProps {
  menu: { icon: React.ReactNode; title: string; to: string }[];
}

export default function useDrawer({ menu }: useDrawerProps) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const openDrawer = () => {
    setOpen(true);
  };

  const closeDrawer = () => {
    setOpen(false);
  };

  const drawer = (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <IconButton onClick={closeDrawer}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List component="div">
        {menu.map((item, index) => (
          <Link key={index} to={item.to}>
            <ListItem
              disablePadding
              component="a"
              sx={{ display: "block", color: "unset" }}
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
    drawer,
    drawerHeader,
  };
}
