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
import VideoList from "../components/video_list/VideoList";
import { IVideo, RoomProps } from "../context/RoomsContext";
import { RoomEvent } from "../RoomEvent";
import { Avatar, AvatarGroup, Button } from "@mui/material";
import ChatBox from "../components/chat_box/ChatBox";
import { useNavigate } from "react-router-dom";

interface IProps {
  socket: Socket;
}

interface ICustomState {
  userId: string;
  roomInfo: RoomProps;
}

const BASE_YOUTUBE_API_URL = "https://www.youtube.com/embed/";

const NewRoom: FC<IProps> = ({ socket }) => {
  const navigate = useNavigate();
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

  const leaveRoom = useCallback(() => {
    navigate("/");
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
  }, [userId, roomInfo.onPlay]);

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
        <div
          className="ui row"
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <SearchBar
            handleChange={setSearch}
            className="ui fluid input "
            handleSubmit={handleSubmit}
            value={search}
          />
          <div className="four wide column">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AvatarGroup max={2}>
                <Avatar>{isAdmin ? "A" : "C"}</Avatar>
                <Avatar />
                <Avatar />
                <Avatar />
              </AvatarGroup>
              <Button
                onClick={leaveRoom}
                sx={{
                  width: "100px",
                  color: "black",
                  backgroundColor: "lightgray",
                }}
              >
                Leave
              </Button>
            </div>
          </div>
        </div>
        <div className="ui row">
          <form className="twelve wide column">
            <VideoDetail
              roomId={roomInfo.roomId}
              socket={socket}
              isAdmin={isAdmin}
              playingVideo={playingVideo}
              updateVideo={updateVideo}
            />
          </form>
          <div className="four wide column">
            <ChatBox />
          </div>
        </div>
        <div className="ui row">
          <div className="sixteen wide column">
            <VideoList videos={videos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
