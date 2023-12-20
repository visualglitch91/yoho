import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({
  portalId,
  children,
}: {
  portalId: string;
  children?: React.ReactNode;
}) {
  const [container, setContainer] = useState<HTMLElement | null>(null);

  //eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const nextContainer = document.getElementById(portalId);

    if (nextContainer && nextContainer !== container) {
      setContainer(nextContainer);
    }
  });

  if (!container) {
    return null;
  }

  return createPortal(<>{children}</>, container);
}
