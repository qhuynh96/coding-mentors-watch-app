import { Socket } from "socket.io-client";

export enum RoomEvent  {
    CONNNECTION= 'CONNNECTION',
    CREATE_ROOM="CREATE_ROOM",
    JOIN_ROOM="JOIN_ROOM",
    SERVER_ROOMS="SERVER_ROOMS",
    CREATED_ROOM="CREATED_ROOM",
    JOIND_ROOM="JOIND_ROOM",
  }
 
export type SocketProps = {
    socket: Socket;
  };