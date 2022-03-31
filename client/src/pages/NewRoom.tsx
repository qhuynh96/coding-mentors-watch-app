import { FC, FormEvent, useState, useMemo } from "react";
import { Socket } from "socket.io-client";
import { useLocation, useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VideoDetail from "../components/videoDetail/VideoDetail";
import VideoList from "../components/VideoList";
import { IVideo, RoomProps } from "../context/RoomsContext";
import { useEffect } from "react";
import { RoomEvent } from "../RoomEvent";

type Props = {
  socket: Socket;
};

interface ICustomState {
  userId: string;
  roomInfo: RoomProps;
}

const BASE_YOUTUBE_API_URL = "https://www.youtube.com/embed/";

const NewRoom: FC<Props> = ({ socket }) => {
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

  const [search, setSearch] = useState<string>(
    "https://www.youtube.com/watch?v=Q5OIg6nmeU4&ab_channel=FUNNYANIMALS"
  );
  const [videos, setVideos] = useState<string[]>([]);

  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const url = `${BASE_YOUTUBE_API_URL}${selectedVideo}`;
  const updateplayingVideo = () => {
    const newUpdate = {
      url: "",
      playing: true,
      lastModifiedVideoAtTimeX: new Date().getTime(),
      playedSecondsAtTimeX: 0,
      totalOffsetTime: 0,
    };
  };

  useEffect(() => {
    setPlayingVideo(roomInfo.onPlay);
  }, [userId]);

  useEffect(() => {
    socket.on(RoomEvent.VIDEO_ONPLAY, (videoOnPlay) => {
      setPlayingVideo(videoOnPlay);
    });
  }, [selectedVideo, socket]);

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
        playAt: new Date().getTime(),
        totalOffsetTime: 0,
      });
    } else {
      setVideos([...videos, searchId]);
    }
    setSearch("");
  };

  const handlePlay = () => {
    setPlayingVideo({ ...playingVideo, playing: !playingVideo.playing });
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
              handlePlay={handlePlay}
              roomId={roomInfo.roomId}
              socket={socket}
              isAdmin={isAdmin}
              playingVideo={playingVideo}
              url={url}
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
