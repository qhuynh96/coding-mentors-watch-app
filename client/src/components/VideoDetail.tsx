import React, { useRef, useLayoutEffect, useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Socket } from "socket.io-client";
import { RoomEvent } from "../RoomEvent"

interface IProps {
  selectedVideo: string | null;
  url: string;
  socket: Socket
}
const initialvalue = {
  playing: false,
  playAt: 0,
  pause: 0,
};
const VideoDetail = (props: IProps) => {
  const [videoOnPlay, setVideoOnplay] = useState<any>(initialvalue);
  const playerRef = useRef<any>();
  const { url, selectedVideo,socket } = props;
  //Set admin to remove controls from clients so movie will play synchronously
  //Will figure out a way for this
  const admin = true;
  /**Handle Player */
  const handlePlay = () => {
    setVideoOnplay((prev: any) => ({
      ...prev,
      playing: true,
      playAt: prev.playAt === 0 ? new Date().getTime() : prev.playAt,
    }));
  };
  const handlePause = () => {
    setVideoOnplay((prev: any) => ({ ...prev, playing: false }));
  };

  /**Pause time calculation*/
  //Use pause period and start time (in second) so we can calculate playing time of movie => solve delay at server
  useEffect(() => {    
    if (videoOnPlay.playing === false) {
      const Calc = () => {
        setVideoOnplay((prev: any) => ({
          ...prev,
          pause:
            prev.playing === true ? complete(prev.pause) : prev.pause + 0.5,
        }));
      };
      let timer: any = setInterval(Calc, 500);

      const complete = (pause: any) => {
        clearInterval(timer);
        timer = null;
        return pause;
      };
    }
  }, [videoOnPlay.playing]);

  /**Youtube automatically plays at a memorised time so I set initial playling false and when we play video it will start at 0 */
  /**If anyone have another idea, please share */
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(
        videoOnPlay.playAt === 0
          ? 0
          : (new Date().getTime() - videoOnPlay.playAt) / 1000 -
              videoOnPlay.pause
      );
      playerRef.current.player.isPlaying = true;
    }
  }, [videoOnPlay.playing]);

  /**Send selectedVideo to socket */
  useEffect(() => {
    !selectedVideo && socket.emit(RoomEvent.SELECT_VIDEO, { selectedVideo });
  }, [url]);

  
  if (!selectedVideo) {
    return <div className="ui embed ">...loading</div>;
  }
  return (
    <div className="ui embed ">
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls={true}
        playing={videoOnPlay.playing}
        onReady={() => console.log(url, selectedVideo)}
        onPlay={handlePlay}
        onPause={handlePause}
        style={{ pointerEvents: `${(!admin && "none") || "auto"}` }}
      />
    </div>
  );
};

export default React.memo(VideoDetail);
