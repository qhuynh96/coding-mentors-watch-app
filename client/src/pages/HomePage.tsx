import { useState, useEffect, useContext, useCallback } from "react";
import { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { TextField, Button } from "@mui/material";
import { RoomEvent } from "../RoomEvent";
import { RoomsContext } from "../context/RoomsContext";
import videoImg from "../components/video_detail/videoImg.jpg";
import { serverAxios } from "../api/server";

type Props = {
  socket: Socket;
  auth: string | null | undefined;
};

function HomePage({ socket, auth }: Props) {
  const navigate = useNavigate();
  const [inputRoomID, setInputRoomID] = useState<string>("");
  const { addNewRoom } = useContext(RoomsContext);
  const [err, setErr] = useState<boolean>(false);
  const createRoom = useCallback(async () => {
    try {
      const res = await serverAxios.post("watch-app/rooms/", { userId: auth });
      const newRoom = res.data;
      addNewRoom && addNewRoom(newRoom);
      navigate(`/room/${newRoom.roomId}`, {
        state: { userId: auth, roomInfo: newRoom },
      });
      socket.emit(RoomEvent.CREATE_ROOM, { newRoom: res.data, userId: auth });
    } catch (err) {
      setErr(true);
    }
  }, [socket, auth, addNewRoom, navigate]);

  const joinRoom = useCallback(async () => {
    try {
      const res = await serverAxios.put(`watch-app/rooms/join/${inputRoomID}`, {
        userId: auth,
      });
      const roomInfo = res.data;
      navigate(`/room/${roomInfo.roomId}`, {
        state: { userId: auth, roomInfo },
      });
      socket.emit(RoomEvent.JOIN_ROOM, {
        roomId: roomInfo.roomId,
        userId: auth,
      });
    } catch (err) {
      setErr(true);
    }
  }, [inputRoomID, socket, auth, setErr, navigate]);

  useEffect(() => {
    socket.on(RoomEvent.CREATED_ROOM, ({ newRoom }) => {
      addNewRoom && addNewRoom(newRoom);
    });
  }, [addNewRoom, socket]);

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
          backgroundColor: "rgba(239,239,239,0.5)",
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
