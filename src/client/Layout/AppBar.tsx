import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Typography } from "@mui/material";

export const PORTAL_ID = "APP_BAR_PORTAL";

export default function AppBar({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextContainer = document.getElementById(PORTAL_ID);

    if (nextContainer && nextContainer !== container) {
      setContainer(nextContainer);
    }
  });

  if (!container) {
    return null;
  }

  return createPortal(
    <>
      <Typography variant="h6" noWrap component="div">
        {title}
      </Typography>
      {children}
    </>,
    container
  );
}
