import React, { useRef, useCallback,useMemo} from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../context/RoomsContext";
import { RoomEvent } from "../RoomEvent";
interface IProps {
  isAdmin: boolean;
  playingVideo: IVideo;
  url: string;
  socket: Socket;
  roomId: string;
}

type processTime = number; // second

const VideoDetail = (props: IProps) => {
  const { isAdmin, playingVideo, socket, roomId } = props;
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
  //   t1 : Video played at
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

  const onReady = useCallback(() => {
    playerRef.current && playerRef.current.seekTo(processTime);

    socket.emit(RoomEvent.SELECT_VIDEO, { playingVideo, roomId });
  }, [playingVideo.url]);

  if (!playingVideo.url) {
    return <div className="ui embed ">...loading</div>;
  }

  return (
    <div className="ui embed ">
      <div>
      <ReactPlayer
        className="reactplayer"
        ref={playerRef}
        url={playingVideo.url}
        controls={false}
        playing={playingVideo.playing}
        onReady={onReady}
        // TODOS: onPlay={handlePlay}
        // TODOS: onPause={handlePause}
      />
      </div>
      
    </div>

  );
};

export default React.memo(VideoDetail);
