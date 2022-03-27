import React, { useRef, } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { IVideo } from "../context/RoomsContext";

interface IProps {
  url: string
  socket: Socket
  isAdmin: boolean
  roomId?: string
  videoOnPlay: IVideo 
  userId: string
}

const VideoDetail = (props: IProps) => {
  const {  isAdmin,  videoOnPlay,userId} = props;
  const playerRef = useRef<any>();
  /**Handle Player */
  // const handlePlay = useCallback(() => {
  //   setVideoOnPlay((prev: any) => ({
  //     ...prev,
  //     playing: true,
  //     playAt: prev.playAt === 0 ? new Date().getTime() : prev.playAt,
  //   }));
  // }, []);
  // const handlePause = () => {
  //   setVideoOnPlay((prev: any) => ({ ...prev, playing: false }));
  // };

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

  /**Youtube automatically plays at a memorised time so I set initial playling false and when we play video it will start at 0 */
  /**If anyone have another idea, please share */
  // useEffect(() => {
  //   if (playerRef.current) {
  //     playerRef.current.seekTo(
  //       videoOnPlay.playAt === 0
  //         ? 0
  //         : (new Date().getTime() - videoOnPlay.playAt) / 1000 -
  //             videoOnPlay.pause
  //     );
  //     playerRef.current.player.isPlaying = true;
  //   }
  // }, [videoOnPlay.playing]);

  // useEffect(() => {
  //   socket.on(RoomEvent.VIDEO_ONPLAY, (videoOnPlay) => {
  //     !isAdmin && setVideoOnPlay(videoOnPlay)
  //   });
  //   console.log("first");
  // }, []);
  useEffect(()=>{
    let time = new Date().getTime()
    console.log((time - videoOnPlay.playAt)/1000 -videoOnPlay.pause)
  },[userId])
 
  const onReady = useCallback(() => {
    /**Reset video figures when a new video is ready */
    playerRef.current.seekTo(0);
    console.log(videoOnPlay)
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
