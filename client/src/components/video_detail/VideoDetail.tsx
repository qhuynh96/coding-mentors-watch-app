import React, { useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../../context/RoomsContext";
import { RoomEvent } from "../../RoomEvent";
import { VideoControlWrapper } from "./styledComponents";
import VideoControl from "../video_control/VideoControl";
import { useVideoControl } from "../video_control/useVideoControl";
import videoImg from "./videoImg.jpg";

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
  const playerRef = useRef<ReactPlayer>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const {
    videoFigures,
    handleMute,
    handleVolumeMouseUp,
    handleVolumeChange,
    handleIsSeekingTo,
    handleSeekToChange,
    handleSeekToMouseUp,
    handlePlayPause,
    handleProgress,
    handleFullScreen,
    handleDuration,
  } = useVideoControl(
    defaultFigures,
    playingVideo,
    playerRef,
    videoContainerRef,
    updateVideo
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

  useEffect(() => {
    /** latestTimeGetVideo : time users get latest update of movie from server */
    const latestTimeGetVideo = new Date().getTime() / 1000;

    const processTime: ProcessTime =
      latestTimeGetVideo - playingVideo.latestUpdateAt + playingVideo.progress;
    playerRef.current && playerRef.current.seekTo(processTime);
  }, [playingVideo]);

  const onReady = useCallback(() => {
    socket.emit(RoomEvent.SELECT_VIDEO, { playingVideo, roomId });
  }, [playingVideo, socket, roomId]);

  if (!playingVideo.url) {
    return (
      <div
        className="ui embed "
        style={{
          height: "100%",
          backgroundImage: `url(${videoImg})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      ></div>
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
        onDuration={handleDuration}
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
          playing={playingVideo.playing}
        />
      </VideoControlWrapper>
    </div>
  );
};

export default React.memo(VideoDetail);
