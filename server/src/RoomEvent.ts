/**
 * ! Both files RoomEvent.ts in the client and the server must be identical
 * before committing any change to this file, in the project directory, please run:
 * git diff --no-index client/src/RoomEvent.ts server/src/RoomEvent.ts
 * and make sure that there is no difference
 */

export enum RoomEvent {
  connection = "connection",
  CREATE_ROOM = "CREATE_ROOM",
  JOIN_ROOM = "JOIN_ROOM",
  JOINED_ROOM = "JOINED_ROOM",
  LEAVE_ROOM = "LEAVE_ROOM",
  LEFT_ROOM = "LEFT_ROOM",
  CREATED_ROOM = "CREATED_ROOM",
  VIDEO_UPDATING = "VIDEO_UPDATING",
  VIDEO_UPDATED = "VIDEO_UPDATED",
  CLIENT_SEND_MSG = "CLIENT_SEND_MSG",
  CLIENT_GET_MSG = "CLIENT_GET_MSG",
}
