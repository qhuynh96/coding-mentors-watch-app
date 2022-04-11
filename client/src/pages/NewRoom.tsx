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
import { serverAxios } from "../api/server";
import { useStorage } from "../hooks/useStorage";

interface IProps {
  socket: Socket;
}
export interface IMsg {
  sender: string;
  text: string;
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
  const [room, setRoom, removeRoom] = useStorage("room", roomInfo);
  const [messages, setMessages, removeMsg] = useStorage<IMsg[] | undefined>(
    "msg",
    [] as IMsg[]
  );
  const isAdmin = useMemo(
    () => userId === roomInfo.admin,
    [userId, roomInfo.admin]
  );
  const [search, setSearch] = useState<string>("");
  const [videos, setVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [text, setText] = useState<string>("");
  const sendMsg = useCallback(
    (text) => {
      if (text.trim() !== "") {
        const msg: IMsg = { sender: userId, text };
        setMessages((prev) => [msg, ...prev!]);
        socket.emit(RoomEvent.CLIENT_SEND_MSG, { roomId, msg });
        setText("");
      }
    },
    [socket, userId, roomId, setMessages]
  );

  const updateVideo = useCallback(
    async (videoUpdate: IVideo) => {
      try {
        const res = await serverAxios.put(
          `/watch-app/rooms/onPlay/${roomId}`,
          videoUpdate
        );
        setRoom((room) => ({ ...room, onPlay: res.data }));
        socket.emit(RoomEvent.VIDEO_UPDATING, {
          videoUpdate: res.data,
          roomId,
        });
      } catch (err) {}
    },
    [setRoom, socket, roomId]
  );

  const leaveRoom = useCallback(async () => {
    try {
      const res = await serverAxios.put(
        `/watch-app/rooms/leave/${roomId}`,
        userId
      );
      removeRoom();
      removeMsg();
      socket.emit(RoomEvent.LEAVE_ROOM, { roomId, userId });
      navigate("/");
    } catch (err) {}
  }, [socket, roomId, userId, removeRoom, removeMsg, navigate]);

  useEffect(() => {
    socket.on(RoomEvent.VIDEO_UPDATED, ({ updatedVideo }) => {
      setRoom((prev) => ({ ...prev, onPlay: updatedVideo }));
    });
    socket.on(RoomEvent.JOINED_ROOM, ({ userId }) => {
      setRoom((prev) => ({ ...prev, members: [...prev!.members!, userId] }));
    });
    socket.on(RoomEvent.LEFT_ROOM, ({ userId }) => {
      setRoom((prev) => ({
        ...prev,
        members: prev!.members!.filter((m) => m !== userId),
      }));
    });
    socket.on(RoomEvent.CLIENT_GET_MSG, ({ msg }) => {
      setMessages((prev) => [msg, ...prev!]);
    });
  }, [socket, setRoom, setMessages]);

  let searchId: string;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim() !== "") {
      searchId = search.includes("&")
        ? search.split("=")[1].split("&")[0]
        : search.split("=")[1];

      if (!selectedVideo) {
        setSelectedVideo(searchId);
        const videoUpdate = {
          url: `${BASE_YOUTUBE_API_URL}${searchId}`,
          playing: true,
          latestUpdateAt: new Date().getTime() / 1000,
          progress: 0,
        };
        updateVideo(videoUpdate);
      } else {
        setVideos([...videos, searchId]);
      }
      setSearch("");
    }
  };
  console.log(messages);
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
                {room?.members?.map((m, i) => {
                  if (i === 0) {
                    return (
                      <Avatar key={i}>
                        {i === 0 && (isAdmin ? "A" : "C")}
                      </Avatar>
                    );
                  } else {
                    return <Avatar key={i} />;
                  }
                })}
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
              isAdmin={isAdmin}
              playingVideo={room?.onPlay as IVideo}
              updateVideo={updateVideo}
            />
          </form>
          <div className="four wide column">
            <ChatBox
              userId={userId}
              text={text}
              setText={(e) => setText(e.target.value)}
              messages={messages}
              sendMsg={sendMsg}
            />
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
