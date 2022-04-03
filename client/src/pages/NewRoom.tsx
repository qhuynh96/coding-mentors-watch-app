import {
  FC,
  FormEvent,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { Socket } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VideoDetail from "../components/video_detail/VideoDetail";
import VideoList from "../components/VideoList";
import { IVideo, RoomProps } from "../context/RoomsContext";
import { RoomEvent } from "../RoomEvent";

interface IProps {
  socket: Socket;
}

interface ICustomState {
  userId: string;
  roomInfo: RoomProps;
}

const BASE_YOUTUBE_API_URL = "https://www.youtube.com/embed/";

const NewRoom: FC<IProps> = ({ socket }) => {
  // TODO: define other socket events (for watching Youtube together/chatting)
  const { roomId } = useParams();
  const location = useLocation();
  const state = location.state as ICustomState;
  const { userId, roomInfo } = state;
  const isAdmin = useMemo(
    () => userId === roomInfo.admin,
    [userId, roomInfo.admin]
  );
  const [playingVideo, setPlayingVideo] = useState<IVideo>({} as IVideo);

  const [search, setSearch] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const updateVideo = useCallback((videoUpdate: IVideo) => {
    setPlayingVideo(videoUpdate);
    socket.emit(RoomEvent.VIDEO_UPDATING, { videoUpdate, roomId });
  }, []);

  useEffect(() => {
    socket.on(RoomEvent.VIDEO_UPDATED, ({ updatedVideo }) => {
      setPlayingVideo(updatedVideo);
    });
    socket.on(RoomEvent.VIDEO_ONPLAY, ({ playingVideo }) => {
      setPlayingVideo(playingVideo);
    });
  }, [socket]);

  useEffect(() => {
    setPlayingVideo(roomInfo.onPlay);
  }, [userId,roomInfo.onPlay]);

  let searchId: string;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchId = search.includes("&")
      ? search.split("=")[1].split("&")[0]
      : search.split("=")[1];

    if (!selectedVideo) {
      setSelectedVideo(searchId);
      setPlayingVideo({
        url: `${BASE_YOUTUBE_API_URL}${searchId}`,
        playing: true,
        latestUpdateAt: new Date().getTime() / 1000,
        progress: 0,
      });
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
            <VideoDetail
              roomId={roomInfo.roomId}
              socket={socket}
              isAdmin={isAdmin}
              playingVideo={playingVideo}
              updateVideo={updateVideo}
            />
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
            <div className="ui row">
              <h1>Upcoming videos</h1>
            </div>
            <div className="ui row">
              <VideoList video={video} />
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
