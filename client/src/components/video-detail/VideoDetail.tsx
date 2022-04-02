import React, { useEffect, useState, useCallback, useMemo } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../../context/RoomsContext";
import { RoomEvent } from "../../RoomEvent";
import { VideoControlWrapper } from "./styledComponents";
import VideoControl from "../video_control/VideoControl";
import { useVideoControl } from "../../hooks/useVideoControl";

interface IProps {
  isAdmin: boolean;
  playingVideo: IVideo;
  socket: Socket;
  roomId: string;
  updateVideo: (videoUpdate: IVideo) => void;
}

type ProcessTime = number; // second

const defaultFigures = {
  playing: true,
  playedSeconds: 0,
  volume: 90,
  duration: 0,
  isSeekingTo: false,
  muted: false,
};

const VideoDetail = (props: IProps) => {
  const { isAdmin, playingVideo, socket, roomId, updateVideo } = props;
  const {
    videoFigures,
    videoContainerRef,
    playerRef,
    handleMute,
    handleVolumeMouseUp,
    handleVolumeChange,
    handleIsSeekingTo,
    handleSeekToChange,
    handleSeekToMouseUp,
    handlePlayPause,
    handleProgress,
    handleFullScreen,
  } = useVideoControl(defaultFigures, playingVideo, updateVideo);
  const [duration, setDuration] = useState<number>(0);
  /** latestTimeGetVideo : time users get latest update of movie from server */
  const latestTimeGetVideo = useMemo<number>(
    () => new Date().getTime() / 1000,
    [playingVideo]
  );
  // ProgressTime is the time in second that the video has been progressed.
  // It is calculated from the formula:
  //
  // ProgressTime = latestTimeGetVideo - latestVideoUpdateAt + Video progress at latestUpdate
  //
  //   ---------v--------------v---------v-------->
  //            t0             t1         t2
  //                --t'1--
  //
  //   t1 : time of the lastest video event (start, seekTo, play & pause)
  //   t0 : time start video
  //   t'1 : video progress at latestUpdate (after event calculation)
  //   t2: time users get lastest movie update from server
  //
  //   ProgressTime =latestTimeGetVideo - latestVideoUpdateAt + Video progress at latestUpdate
  //                = t2 - t1 + t'1

  const processTime: ProcessTime =
    latestTimeGetVideo - playingVideo.latestUpdateAt + playingVideo.progress;

  /**Handle video events */

  const onReady = useCallback(() => {
    socket.emit(RoomEvent.SELECT_VIDEO, { playingVideo, roomId });
  }, [playingVideo.url]);

  const onDuration = useCallback(
    (duration: number) => {
      setDuration(duration);
    },
    [playingVideo.url]
  );

  useEffect(() => {
    playerRef.current && playerRef.current.seekTo(processTime);
  }, [playingVideo]);

  if (!playingVideo.url) {
    return (
      <div className="ui embed ">
        <p>...loading</p>
      </div>
    );
  }

  return (
    <div ref={videoContainerRef} className="ui embed ">
      <ReactPlayer
        className="reactplayer"
        ref={playerRef}
        url={playingVideo.url}
        controls={false}
        playing={playingVideo.playing}
        onReady={onReady}
        onProgress={handleProgress}
        onDuration={onDuration}
        volume={videoFigures.volume}
        muted={videoFigures.muted}
        style={{ pointerEvents: "none" }}
      />
      <VideoControlWrapper>
        <VideoControl
          handleFullScreen={handleFullScreen}
          isAdmin={isAdmin}
          handleVolumeMouseUp={handleVolumeMouseUp}
          handleVolumeChange={handleVolumeChange}
          handleSeekToChange={handleSeekToChange}
          handleSeekToMouseUp={handleSeekToMouseUp}
          handleIsSeekingTo={handleIsSeekingTo}
          handleMute={handleMute}
          handlePlayPause={handlePlayPause}
          videoFigures={videoFigures}
          duration={duration}
          playing={playingVideo.playing}
        />
      </VideoControlWrapper>
    </div>
  );
};

export default React.memo(VideoDetail);
