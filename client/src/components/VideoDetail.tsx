import React, { useRef,useLayoutEffect,useState,useEffect} from "react";
import ReactPlayer from "react-player";

interface IProps {
  selectedVideo: string | null;
  url: string;
}
const initialvalue = {
  playing: false,
  playAt: 0,
  pause: 0,
};
const VideoDetail = (props: IProps) => {
  const [videoOnPlay, setVideoOnplay] = useState<any>(initialvalue);
  const playerRef = useRef<any>();
  const { url, selectedVideo } = props;
  const admin = true
  /**Handle Player */
  const handlePlay = () => {
    setVideoOnplay((prev: any) => ({ ...prev,playing: true, playAt: prev.playAt === 0 ? new Date().getTime(): prev.playAt }));    
  };
  const handlePause = () => {
    setVideoOnplay((prev: any) => ({ ...prev,playing: false }));    
  };

  /**Pause time calculation*/
  useEffect(()=>{
    if (videoOnPlay.playing ===  false) {
      const Calc =()=>{
        setVideoOnplay((prev:any)=>({...prev, pause: prev.playing === true ? complete(prev.pause): prev.pause + 0.5}))
      }
      let timer: any = setInterval(Calc,500)

      const complete = (pause:any) =>{
        clearInterval(timer);
        timer = null;
        return pause
      }
    } 
  },[videoOnPlay.playing])
  
  /**Set Time playing at */
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(videoOnPlay.playAt === 0 ? 0 :(new Date().getTime()-videoOnPlay.playAt)/1000- videoOnPlay.pause);
      playerRef.current.player.isPlaying = true;
    }
  }, [videoOnPlay.playing]);

  useEffect(()=>{
    if (playerRef.current) {
      playerRef.current.seekTo(videoOnPlay.playAt === 0 ? 0 :(new Date().getTime()-videoOnPlay.playAt)/1000- videoOnPlay.pause);
    }
    console.log('url')
  },[url])

    //  //Play video
    //  const handlePlay = (src: string, room: RoomProps) =>{
    //   if (!room.onPlay) {
    //     const videoOnPlay = {src, playing: true, start: (new Date()).toISOString(), pause: 0}
    //     playVideo && playVideo(videoOnPlay,room.roomId)
    //   //Emit to server
    //     
    //   }     
    //   //Send resquest for next movie 
    // }
  if (!selectedVideo) {
    return <div className="ui embed ">...loading</div>;
  }
  return (
    <div className="ui embed ">
      <ReactPlayer
        ref={playerRef}
        url={url}
        controls = {true}
        playing={videoOnPlay.playing}
        onReady={() => console.log(url, selectedVideo)}
        onPlay={handlePlay}
        onPause={handlePause}
        style={{ pointerEvents: `${!admin && 'none' || 'auto'}`}}
      />
    </div>
  );
};

export default React.memo(VideoDetail);
