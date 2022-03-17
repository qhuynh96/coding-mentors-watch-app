import { Socket } from "socket.io-client";

export enum RoomEvent  {
  connection= 'connection',
  CREATE_ROOM="CREATE_ROOM",
  JOIN_ROOM="JOIN_ROOM",
  LEAVE_ROOM="LEAVE_ROOM",
  SERVER_ROOMS="SERVER_ROOMS",
  JOINED_ROOM="JOINED_ROOM",
  CREATED_ROOM="CREATED_ROOM",
  PLAY_VIDEO = "PLAY_VIDEO"
}
 
export type SocketProps = {
    socket: Socket;
  };