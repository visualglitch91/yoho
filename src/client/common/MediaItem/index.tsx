import {
  Box,
  ButtonBase,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";

export default function MediaItem({
  title,
  poster,
  color = "primary",
  percent = 100,
  width = 140,
  height = 210,
  onClick,
}: {
  title: string;
  poster: string;
  color?: LinearProgressProps["color"];
  width?: number;
  height?: number;
  percent?: number | false;
  onClick?: () => void;
}) {
  return (
    <ButtonBase
      sx={{
        display: "flex",
        flexDirection: "column",
        width: width,
        borderRadius: "4px",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <Box
        sx={(theme) => ({
          background: theme.palette.background.default,
          width,
          height,
          "& > img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
          },
        })}
      >
        <img src={poster} alt="" title={title} loading="lazy" />
      </Box>
      {percent !== false && (
        <LinearProgress
          sx={{ width: "100%" }}
          variant="determinate"
          value={percent}
          color={color}
        />
      )}
    </ButtonBase>
  );
}
