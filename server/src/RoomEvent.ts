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
  LEAVE_ROOM = "LEAVE_ROOM",
  SERVER_ROOMS = "SERVER_ROOMS",
  JOINED_ROOM = "JOINED_ROOM",
  CREATED_ROOM = "CREATED_ROOM",
  SELECT_VIDEO="SELECT_VIDEO"
}
