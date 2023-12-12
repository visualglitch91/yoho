import {
  Box,
  ButtonBase,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";

const imageStyle = {
  width: 140,
  height: 210,
};

export default function MediaItem({
  title,
  poster,
  color,
  percent = 100,
  onClick,
}: {
  title: string;
  poster: string;
  color: LinearProgressProps["color"];
  percent?: number;
  onClick?: () => void;
}) {
  return (
    <ButtonBase
      sx={{
        display: "flex",
        flexDirection: "column",
        width: imageStyle.width,
        borderRadius: "4px",
        overflow: "hidden",
      }}
      onClick={onClick}
    >
      <Box
        sx={(theme) => ({
          background: theme.palette.background.default,
          ...imageStyle,
          "& > img": {
            width: "100%",
            height: "100%",
            objectFit: "cover",
          },
        })}
      >
        <img src={poster} alt="" title={title} loading="lazy" />
      </Box>
      <LinearProgress
        sx={{ width: "100%" }}
        variant="determinate"
        value={percent}
        color={color}
      />
    </ButtonBase>
  );
}