import { Fab as MuiFab, FabProps } from "@mui/material";

const fabStyle = {
  position: "fixed",
  bottom: 32,
  right: 16,
};

export default function Fab(props: FabProps) {
  return <MuiFab {...props} sx={fabStyle} />;
}
