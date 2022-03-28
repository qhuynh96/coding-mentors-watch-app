import React, { useRef,useCallback } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../context/RoomsContext";
import { RoomEvent } from "../RoomEvent";

interface IProps {
  isAdmin: boolean
  videoOnPlay: IVideo 
  url: string
  socket: Socket
  roomId: string
}

const VideoDetail = (props: IProps) => {
  const {  isAdmin,videoOnPlay,socket,roomId} = props;
  const playerRef = useRef<any>();
  
  /**Pause time calculation*/
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
    /**Reset video figures when a new video is ready */
    playerRef.current.seekTo(0)
    /**set Time play at for new participant */
    let time = new Date().getTime()
    playerRef.current.seekTo((time - videoOnPlay.playAt)/1000 - videoOnPlay.pause)
    socket.emit(RoomEvent.SELECT_VIDEO,({videoOnPlay, roomId}))

  }, [videoOnPlay.url]);

  console.log(videoOnPlay)

  if (!videoOnPlay.url ) {
    return <div className="ui embed ">...loading</div>;
  }
  return (
    <div className="ui embed ">
      <ReactPlayer
        ref={playerRef}
        url={videoOnPlay.url}
        controls={true}
        playing={videoOnPlay.playing}
        onReady={onReady}
        // onPlay={handlePlay}
        // onPause={handlePause}
        style={{ pointerEvents: `${(!isAdmin && "none") || "auto"}` }}
      />
    </div>
  );
};

export default React.memo(VideoDetail);
