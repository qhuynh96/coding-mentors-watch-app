import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../../context/RoomsContext";
import { RoomEvent } from "../../RoomEvent";
import { VideoControlWrapper } from "./styledComponents";
import VideoControl from "../videoControl/VideoControl";
import screenful from "screenfull";
interface IProps {
  isAdmin: boolean;
  playingVideo: IVideo;
  socket: Socket;
  roomId: string;
  updateVideo: (videoUpdate: IVideo) => void;
}

export interface IVideoFigures {
  playing: boolean;
  playedSeconds: number; //seconde
  volume: number;
  duration: number; //video duration (second)
  isSeekingTo: boolean; //true && move to arbitrary point
  muted: boolean;
}
type processTime = number; // second
type changingState = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

const initailFirgure = {
  playing: true,
  playedSeconds: 0,
  volume: 100,
  duration: 0,
  isSeekingTo: false,
  muted: false,
};

const VideoDetail = (props: IProps) => {
  const { isAdmin, playingVideo, socket, roomId, updateVideo } = props;
  const [videoFigures, setVideoFigures] =
    useState<IVideoFigures>(initailFirgure);
  const [duration,setDuration] = useState<number>(0)
  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<any>()
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

  const processTime: processTime =
    latestTimeGetVideo - playingVideo.latestUpdateAt + playingVideo.progress;

  /**Handle video events */
  const handleMute = () => {
    setVideoFigures({ ...videoFigures, muted: !videoFigures.muted });
  };
  const handleVolumeChange = (e: any, newValue: number) => {
    setVideoFigures({
      ...videoFigures,
      volume: newValue / 100,
      muted: newValue === 0 ? true : false,
    });
  };
  const handleVolumeMouseUp = (e: any, newValue: number) => {
    setVideoFigures({
      ...videoFigures,
      volume: newValue / 100,
      muted: newValue === 0 ? true : false,
    });
  };

  const handleIsSeekingTo = () => {
    setVideoFigures({ ...videoFigures, isSeekingTo: true });
  };

  const handleSeekToChange = (e: any, newValue: number) => {
    setVideoFigures({ ...videoFigures, playedSeconds: newValue });
  };

  const handleSeekToMouseUp = (e: any, newValue: number) => {
    playerRef.current && playerRef.current.seekTo(newValue);
    setVideoFigures({ ...videoFigures,playedSeconds: newValue, isSeekingTo: false });
    const videoUpdate = {
      ...playingVideo,
      progress: newValue,
      latestUpdateAt: (new Date().getTime() / 1000),
    };
    updateVideo(videoUpdate);
  };

  const handlePlayPause = () => {
    const progress = playerRef.current!.getCurrentTime();
    const videoUpdate = {
      ...playingVideo,
      progress: progress,
      latestUpdateAt: (new Date().getTime() / 1000),
      playing: !playingVideo.playing,
    };
    updateVideo(videoUpdate);
  };

  const handleProgress = useCallback((changingState: changingState) => {
    if (!videoFigures.isSeekingTo) {
      setVideoFigures({
        ...videoFigures,
        ...changingState,
      });
    }
  },[videoFigures.playedSeconds]);

  const handleFullScreen = () =>{
    videoContainerRef.current && screenful.toggle(videoContainerRef.current)
  }
  const onReady = useCallback(() => {    
    socket.emit(RoomEvent.SELECT_VIDEO, { playingVideo, roomId });
  }, [playingVideo.url]);

  const onDuration= useCallback((duration: number)=>{
    setDuration(duration)
  },[playingVideo.url])

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
        style={{ pointerEvents: "none"}}
      />
      <VideoControlWrapper >
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
