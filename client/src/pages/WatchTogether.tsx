import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";

type Props = {
  socket: Socket;
};

// TODO: replace this page with Trang's page for watching together
// TODO: this page's purpose is for testing creating/joining buttons' logic only

export default function WatchTogether({ socket }: Props) {
  // TODO: define other socket events (for watching Youtube together/chatting)
  const { roomID } = useParams();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <h1>Watch Together Page - Your room's ID is: {roomID}</h1>
    </div>
  );
}
