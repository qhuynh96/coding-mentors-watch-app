import React, { useState, useRef, useCallback, useMemo } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../../context/RoomsContext";
import { RoomEvent } from "../../RoomEvent";
import { VideoControlWrapper } from "./styledComponents";
import VideoControl from "../videoControl/VideoControl";
interface IProps {
  isAdmin: boolean;
  playingVideo: IVideo;
  url: string;
  socket: Socket;
  roomId: string;
  handlePlay: () => void;
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
  const { isAdmin, playingVideo, socket, roomId, handlePlay } = props;
  const [videoFigures, setVideoFigures] =
    useState<IVideoFigures>(initailFirgure);
  const playerRef = useRef<ReactPlayer | null>(null);
  // joinedTime is the time when a user start wathching
  // joinedTime will reset every movie url set up
  const joinedTime = useMemo<number>(
    () => new Date().getTime(),
    [playingVideo.url]
  );
  // ProgressTime is the time in millisecond/second that the video has been progressed.
  // It is calculated from the formula:
  //
  // ProgressTime = VideoPlayTime - JoinedTime - Sum of Offset Time
  //
  //   ---------v-----------------------v-------->
  //            t1                      t2
  //                 |***|        |**|
  //                  t3           t3'
  //   t1 : Video playedSeconds at
  //   t2 : User started watching movie
  //   t3 : Pause time 1
  //   t3': Pause time 2
  //
  //   ProgressTime =JoinedTime - VideoPlayTime  - Sum of Offset Time
  //                = t2 - t1 - (t3 + t3');
  //
  // What is the total offset time?
  // The offset time is accumulated when one of the following events happen:
  //      * The video is pause. The offset time is increased by an amount of the pause time
  //      * The video jump to an arbitrary point in time.
  //              1. If the video jumps ahead of time. The offset is decreased by the amount of the jumping time
  //              2. If the video jumps back of time. The offset is increased by the amount of the jumping time

  const processTime: processTime =
    (joinedTime - playingVideo.playAt - playingVideo.totalOffsetTime) / 1000;

  /**TODOs: Pause time calculation*/
  //Use pause period and start time (in second) so we can calculate playing time of movie => solve delay at server
  // useEffect(() => {
  //   if (videoOnPlay.playing === false) {
  //     const Calc = () => {
  //       setVideoOnPlay((prev: any) => ({
  //         ...prev,
  //         pause:
  //           prev.playing === true ? complete(prev.pause) : prev.pause + 0.5,
  //       }));
  //     };
  //     let timer: any = setInterval(Calc, 500);

  //     const complete = (pause: any) => {
  //       clearInterval(timer);
  //       timer = null;
  //       return pause;
  //     };
  //   }
  // }, [videoOnPlay.playing]);

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
    setVideoFigures({...videoFigures, isSeekingTo:true})
  };

  const handleSeekToChange = (e: any, newValue: number) => {
    setVideoFigures({...videoFigures,playedSeconds: newValue })
  };

  const handleSeekToMouseUp = (e: any, newValue: number) => {
    setVideoFigures({...videoFigures, isSeekingTo: false})
    playerRef.current && playerRef.current.seekTo(newValue )
    
  };

  const onReady = useCallback(() => {
    playerRef.current && playerRef.current.seekTo(processTime);

    socket.emit(RoomEvent.SELECT_VIDEO, { playingVideo, roomId });
  }, [playingVideo.url]);

  const onProgress = (changingState: changingState) => {
    setVideoFigures({
      ...videoFigures,
     ...changingState,
    });
  };

  if (!playingVideo.url) {
    return (
      <div className="ui embed relative">
        <p>...loading</p>
      </div>
    );
  }

  return (
    <div className="ui embed relative">
      <ReactPlayer
        className="reactplayer"
        ref={playerRef}
        url={playingVideo.url}
        controls={false}
        onDuration={(duration) =>
          setVideoFigures({ ...videoFigures, duration: duration })
        }
        playing={playingVideo.playing}
        onReady={onReady}
        onProgress={onProgress}
        volume={videoFigures.volume}
        muted={videoFigures.muted}
        // TODOS: onPlay={handlePlay}
        // TODOS: onPause={handlePause}
      />
      <VideoControlWrapper>
        <VideoControl
          isAdmin={isAdmin}
          handleVolumeMouseUp={handleVolumeMouseUp}
          handleVolumeChange={handleVolumeChange}
          handleSeekToChange={handleSeekToChange}
          handleSeekToMouseUp={handleSeekToMouseUp}
          handleIsSeekingTo={handleIsSeekingTo}
          handleMute={handleMute}
          handlePlay={handlePlay}
          videoFigures={videoFigures}
          playing={playingVideo.playing}
        />
      </VideoControlWrapper>
    </div>
  );
};

export default React.memo(VideoDetail);
