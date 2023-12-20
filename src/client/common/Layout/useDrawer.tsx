import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  List,
  Tooltip,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Drawer,
} from "@mui/material";

export const toggleDrawerRef = {
  current: (() => {}) as (open?: boolean) => void,
};

export interface useDrawerProps {
  menu: { icon: React.ReactNode; title: string; to: string }[];
}

export default function useDrawer({ menu }: useDrawerProps) {
  const [open, setOpen] = useState(false);
  const [location] = useLocation();

  const toggleDrawer = (flag?: boolean) => {
    setOpen(typeof flag === "boolean" ? flag : !open);
  };

  useEffect(() => {
    setOpen(false);
  }, [location]);

  toggleDrawerRef.current = toggleDrawer;

  const drawer = (
    <List component="div" sx={{ p: 0, minWidth: { xs: 260, md: "unset" } }}>
      {menu.map((item, index) => (
        <Link key={index} to={item.to}>
          <ListItem
            disablePadding
            component="a"
            sx={(theme) => ({
              borderRadius: { md: `${theme.shape.borderRadius}px` },
              overflow: "hidden",
              display: "block",
              color: "white",
              mb: { md: 1 },
              backgroundColor: location.startsWith(item.to)
                ? theme.palette.primary.dark
                : undefined,
            })}
          >
            <Tooltip
              componentsProps={{
                popper: {
                  sx: { display: { xs: "none", md: "block", lg: "none" } },
                },
                tooltip: {
                  sx: (theme) => ({
                    fontSize: 14,
                    py: 1,
                    px: 2,
                    background: theme.palette.grey[100],
                    color: theme.palette.grey[800],
                  }),
                },
              }}
              title={item.title}
              placement="right"
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
                    mr: { xs: 2, md: 0, lg: 2 },
                    minWidth: 0,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    display: { sx: "block", md: "none", lg: "block" },
                    "& .MuiListItemText-primary": {
                      fontSize: { xs: 14, lg: 14, xl: 16 },
                    },
                  }}
                />
              </ListItemButton>
            </Tooltip>
          </ListItem>
        </Link>
      ))}
    </List>
  );

  const mobileDrawer = (
    <Drawer
      open={open}
      sx={{ display: { md: "none" } }}
      onClose={() => toggleDrawer(false)}
    >
      {drawer}
    </Drawer>
  );

  return {
    drawer,
    mobileDrawer,
    toggleDrawer,
  };
}
