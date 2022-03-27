import { FC, FormEvent, useState,useMemo } from "react";
import { Socket } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VideoDetail from "../components/VideoDetail";
import VideoList from "../components/VideoList";
import { IVideo, RoomProps } from "../context/RoomsContext";
import { useEffect } from "react";
import { RoomEvent } from "../RoomEvent";

type Props = {
  socket: Socket
};

interface CustomState {
  userId: string
}

const BASE_YOUTUBE_API_URL = "https://www.youtube.com/embed/";

const NewRoom: FC<Props> = ({ socket }) => {
  // TODO: define other socket events (for watching Youtube together/chatting)
  const { roomId } = useParams()  
  const location = useLocation()
  const state = location.state as CustomState
  const [isAdmin,setIsAdmin]= useState(true)
  const {userId} = state
  useEffect(()=>{
    socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomDetail }) => {
      setIsAdmin(state.userId === roomDetail.admin)
      setVideoOnPlay({...roomDetail.onPlay})
      console.log(roomDetail)
    });
  },[userId])

  useEffect(()=>{
    socket.on(RoomEvent.VIDEO_ONPLAY,(videoOnPlay)=>{
      setVideoOnPlay(videoOnPlay)
    })
  },[socket])
  
  const [videoOnPlay, setVideoOnPlay] = useState<IVideo>({} as IVideo)

  const [search, setSearch] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);
  //DO we need to set selectedVideo or ju
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  
  const url = `${BASE_YOUTUBE_API_URL}${selectedVideo}`;
  
  useEffect(()=>{
    if (videoOnPlay !== {} as IVideo) {socket.emit(RoomEvent.SELECT_VIDEO,({videoOnPlay, roomId}))}
  },[selectedVideo])
  let searchId: string;

  
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchId = search.includes("&")
      ? search.split("=")[1].split("&")[0]
      : search.split("=")[1];

    if (!selectedVideo) {
      setSelectedVideo(searchId);
      setVideoOnPlay({url: `${BASE_YOUTUBE_API_URL}${searchId}`, playing: true, playAt: new Date().getTime(), pause: 0})
    } else {
      setVideos([...videos, searchId]);
    }
    setSearch("");
  };

  return (
    <div className="ui segment">
      <div className="ui grid">
        <div className="ui row">
          <SearchBar
            handleChange={setSearch}
            className="ui fluid input"
            handleSubmit={handleSubmit}
            value={search}
          />
          <div className="six wide column">
            <button className="ui  fluid  button">Menu</button>
          </div>
        </div>
        <div className="ui row">
          <form className="ten wide column">
            <VideoDetail userId={userId} isAdmin={isAdmin} videoOnPlay={videoOnPlay}  socket={socket} url={url}  />
          </form>
          <div
            className="four wide column"
            style={{ border: "1px solid black" }}
          >
            <h3>isAdmin: {JSON.stringify(isAdmin)}</h3>
          </div>
        </div>
        <div className="ui row ">
          <div className="ten wide column">
            <div className="column">
              <h1>Upcoming videos: </h1>
            </div>
          </div>
          <div className="ten wide column">
            <div className="ui grid column">
              <div className="five column row">
                <VideoList videos={videos} />
              </div>
            </div>
          </div>
          <div
            className="four wide column"
            style={{ border: "1px solid black" }}
          >
            <h3>Chat box (room {roomId})</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
