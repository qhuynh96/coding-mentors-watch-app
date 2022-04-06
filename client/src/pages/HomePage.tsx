import { useState, useEffect, useContext, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { RoomEvent } from "../RoomEvent";
import { RoomsContext } from "../context/RoomsContext";
import videoImg from "../components/video_detail/videoImg.jpg";
type Props = {
  socket: Socket;
  auth: string | null;
};

function HomePage({ socket, auth }: Props) {
  const navigate = useNavigate();
  const [inputRoomID, setInputRoomID] = useState<string>("");
  const { rooms, getRooms, addNewRoom } = useContext(RoomsContext);

  const createRoom = useCallback(() => {
    socket.emit(RoomEvent.CREATE_ROOM, { roomId: uuidv4(), userId: auth });
  }, [socket, auth]);

  const joinRoom = useCallback(() => {
    socket.emit(RoomEvent.JOIN_ROOM, { roomId: inputRoomID, userId: auth });
  }, [inputRoomID, socket, auth]);

  useEffect(() => {
    socket.on(RoomEvent.CREATED_ROOM, ({ userId, newRoom }) => {
      addNewRoom && addNewRoom(newRoom);

      auth === userId &&
        navigate(`/room/${newRoom.roomId}`, {
          state: { userId, roomInfo: newRoom },
        });
    });

    socket.on(RoomEvent.JOINED_ROOM, ({ userId, roomInfo }) => {
      // TODOs: add roomInfo into context for homepage display
      auth === userId &&
        navigate(`/room/${roomInfo.roomId}`, { state: { userId, roomInfo } });
    });
  }, [addNewRoom, getRooms, socket, navigate, auth]);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          position: "absolute",
          height: "100vh",
          width: "100%",
          top: 0,
          left: 0,
          backgroundColor: "lightgray",
        }}
      >
        <video
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.8,
          }}
          autoPlay
          loop
          muted
          src="https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/GTYSdDW/world-map-sketching-looping-animation-black-and-white-4k-resolution-ultra-hd_v1xgpd6x__ecd759e6e0d9e4e517989abc9f26b4a3__P360.mp4"
        />
      </div>
      <div
        style={{
          width: "300px",
          borderRadius: "10px",
          minHeight: "150px",
          backgroundColor: "rgba(239,239,239,0.5",
          zIndex: 2,
          backdropFilter: "blur(5px)",
          display: "grid",
          gridTemplateColumns: "auto",
          gap: "5px",
          alignItems: "center",
          justifyItems: "center",
          padding: "10px",
        }}
      >
        <div className="roomImg">
          <img src={videoImg} alt="" />
        </div>
        <TextField
          label="RoomID"
          id="roomID-input"
          type="text"
          variant="filled"
          value={inputRoomID}
          sx={{ backgroundColor: "white", width: "100%" }}
          onChange={useCallback(
            (event) => setInputRoomID(event.target.value),
            []
          )}
          placeholder="Enter room ID"
        />
        <div
          className="btns"
          style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
          }}
        >
          <Button
            sx={{ color: "black", backgroundColor: "white" }}
            onClick={joinRoom}
          >
            Join
          </Button>
          <Button
            sx={{ color: "black", backgroundColor: "white" }}
            onClick={createRoom}
          >
            Create Room
          </Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
