import { Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import {
  Fullscreen,
  PlayCircle,
  VolumeUp,
  VolumeOff,
  PauseCircle,
} from "@mui/icons-material";
import { IVideoFigures } from "./useVideoControl";
import { VideoProgressSlider, VolumeSilder } from "./styledComponents";

interface IProps {
  isAdmin: boolean;
  videoFigures: IVideoFigures;
  playing: boolean;
  handlePlayPause: () => void;
  handleMute: () => void;
  handleVolumeChange: (event: Event, newValue: number | number[]) => void;
  handleVolumeMouseUp: (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => void;
  handleIsSeekingTo: () => void;
  handleSeekToChange: (event: Event, newValue: number | number[]) => void;
  handleSeekToMouseUp: (
    event: Event | React.SyntheticEvent<Element, Event>,
    newValue: number | number[]
  ) => void;
  handleFullScreen: () => void;
}

const VideoControl = (props: IProps) => {
  const {
    isAdmin,
    videoFigures,
    playing,
    handlePlayPause,
    handleMute,
    handleVolumeChange,
    handleVolumeMouseUp,
    handleSeekToChange,
    handleSeekToMouseUp,
    handleIsSeekingTo,
    handleFullScreen,
  } = props;
  const { playedSeconds, muted, volume, duration } = videoFigures;
  const formatedProgress = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`;
  };
  return (
    <Grid container>
      {isAdmin && (
        <Grid item xs={12}>
          <VideoProgressSlider
            valueLabelDisplay="auto"
            aria-label="pretto slider"
            value={playedSeconds}
            min={0}
            max={duration}
            onMouseDown={handleIsSeekingTo}
            onChange={handleSeekToChange}
            onChangeCommitted={handleSeekToMouseUp}
          />
        </Grid>
      )}
      <Grid item xs container justifyContent="space-between">
        <Grid
          item
          xs="auto"
          container
          alignItems="center"
          justifyContent="center"
        >
          {isAdmin && (
            <IconButton onClick={handlePlayPause}>
              {!playing ? (
                <PlayCircle sx={{ color: "white" }} />
              ) : (
                <PauseCircle sx={{ color: "white" }} />
              )}
            </IconButton>
          )}
          <IconButton sx={{ color: "white" }} onClick={handleMute}>
            {muted ? <VolumeOff /> : <VolumeUp sx={{ color: "white" }} />}
          </IconButton>
          <VolumeSilder
            onChange={handleVolumeChange}
            onChangeCommitted={handleVolumeMouseUp}
            value={muted ? 0 : volume}
            min={0}
            max={100}
          />
          <Typography sx={{ marginLeft: 2, color: "white" }}>
            {formatedProgress(playedSeconds as number)}
          </Typography>
        </Grid>
        <Grid item xs={1} container justifyContent="end">
          <IconButton onClick={handleFullScreen}>
            <Fullscreen sx={{ color: "white" }} />
          </IconButton>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default VideoControl;
