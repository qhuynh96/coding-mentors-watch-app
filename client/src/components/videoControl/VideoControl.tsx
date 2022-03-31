import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import {
  Fullscreen,
  PlayCircle,
  VolumeUp,
  VolumeOff,
  PauseCircle,
} from "@mui/icons-material";
import { IVideoFigures } from "../videoDetail/VideoDetail";
import { VideoProgressSlider, VolumeSilder } from "./styledComponents";
interface IProps {
  isAdmin: boolean
  videoFigures: IVideoFigures;
  handlePlay: () => void;
  handleMute: () => void;
  handleVolumeChange: (event: Event, newValue: any) => void;
  handleVolumeMouseUp: (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: any
  ) => void;
  playing: boolean;
  handleIsSeekingTo: () =>void;
  handleSeekToChange: (event: Event, newValue: any) => void;
  handleSeekToMouseUp:  (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: any
  ) => void;
}

const VideoControl = (props: IProps) => {
  const {
    isAdmin,
    videoFigures,
    handlePlay,
    handleMute,
    handleVolumeChange,
    handleVolumeMouseUp,
    playing,
    handleSeekToChange,
    handleSeekToMouseUp,
    handleIsSeekingTo,
  } = props;
  const { playedSeconds, muted,volume,duration } = videoFigures;

  return (
    <Grid container>
      {isAdmin && <Grid item xs={12}>
        <VideoProgressSlider
          valueLabelDisplay="auto"
          aria-label="pretto slider"
          value={playedSeconds }
          min={0}
          max={duration}
          onMouseDown={handleIsSeekingTo}
          onChange={handleSeekToChange}
          onChangeCommitted={handleSeekToMouseUp}
        />
      </Grid>}
      <Grid item xs container justifyContent="space-between">
        <Grid
          item
          xs="auto"
          container
          alignItems="center"
          justifyContent="center"
        >
         {isAdmin && <IconButton onChange={handlePlay}>
            {!playing ? (
              <PlayCircle sx={{ color: "white" }} />
            ) : (
              <PauseCircle sx={{ color: "white" }} />
            )}
          </IconButton>}
          <IconButton sx={{ color: "white" }} onChange={handleMute}>
            {muted ? <VolumeOff /> : <VolumeUp sx={{ color: "white" }} />}
          </IconButton>
          <VolumeSilder
            onChange={handleVolumeChange}
            onChangeCommitted={handleVolumeMouseUp}
            value={muted ? 0 : volume * 100}
            min={0}
            max={100}
            defaultValue={100}
          />
          <Typography sx={{ marginLeft: 2, color: "white" }}>00:00</Typography>
        </Grid>
        <Grid item xs={1} container justifyContent="end">
          <IconButton>
            <Fullscreen sx={{ color: "white" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoControl;
