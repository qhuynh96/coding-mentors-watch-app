export type VideoProps = {
  url: string; //https
  playing: Boolean; // true ? play : pause
  start: string; // (milisecond) time the video played at
  totalOffsetTime: number; // (milisecond) calculated when one of following events happen: pause or jump to an arbitrary point of time
};

export interface Room {
  admin: string;
  roomId: string;
  members: string[];
  onPlay: VideoProps;
  videos: string[];
}

export interface RoomActs {
  userId: string;
  roomId: string;
}

const rooms: Array<Room> = [];

export const setVideoOnPlay = (playingVideo: VideoProps, roomId: string) => {
  rooms.forEach(
    (room: Room) => room.roomId === roomId && (room.onPlay = playingVideo)
  );
  return { playingVideo, roomId };
};

export const getRooms = () => {
  return rooms;
};

export const createRoom = (newRoom: Room) => {
  // check if the new room's ID does not already exist
  if (!rooms.some((r) => r.roomId === newRoom.roomId)) {
    rooms.push(newRoom);
  }
  /**
   * TODO: add error handling (case: the ID already exists)
   * this task is not important in the near future
   * given how unlikely it is to have duplicate room IDs
   */
  return newRoom;
};

export const joinRoom = ({ userId, roomId }: RoomActs) => {
  /**
   * roomId: ID of the room the user wish to join
   * below, we check if a room with that ID exists
   * if yes, add the userId to the room's list of members (ie. the user joins the room)
   */
  rooms.forEach((room) => {
    if (room.roomId === roomId) {
      room.members.push(userId);
    }
    // TODO: add error handling (case: roomId doesn't exist)
  });
  const roomInfo = rooms.filter((room) => room.roomId === roomId)[0];

  return { userId, roomInfo };
};

export const leaveRoom = ({ userId, roomId }: RoomActs) => {};
