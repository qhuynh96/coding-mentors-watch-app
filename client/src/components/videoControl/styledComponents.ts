import styled from "@emotion/styled";
import { Slider } from "@mui/material";

export const VideoProgressSlider = styled(Slider)({
  padding: 0,
  height: 3,
  "& .MuiSlider-track": {
    border: "none",
  },
  "& .MuiSlider-root": {
    padding: "0px",
  },
  "& .MuiSlider-thumb": {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
      boxShadow: "inherit",
    },
    "&:before": {
      display: "none",
    },
  },
  "& .MuiSlider-valueLabel": {
    display: 'none',
  },
});

export const VolumeSilder = styled(Slider)({
  width: "100px",
  height: 1,
  " & .MuiSlider-thumb": {
    height: 12,
    width: 12,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
  },
});
