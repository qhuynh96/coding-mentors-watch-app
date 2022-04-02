export type VideoProps = {
  url: string; // https
  playing: boolean; // true ? play : pause
  latestUpdateAt: number; // (second) start, seekTo, play & pause
  progress: number; // (second) video progress at latestUpdate
};

export interface IRoom {
  admin: string;
  roomId: string;
  members: string[];
  onPlay: VideoProps;
  videos: string[];
}

export interface IRoomActs {
  userId: string;
  roomId: string;
}

const rooms = new Map<string, IRoom>();

export const setVideoOnPlay = (playingVideo: VideoProps, roomId: string) => {
  const room = rooms.get(roomId) as IRoom;
  room.onPlay = playingVideo;
  return { playingVideo, roomId };
};

export const getRooms = () => {
  return rooms.values();
};

export const createRoom = (newRoom: IRoom) => {
  // check if the new room's ID does not already exist
  if (!rooms.has(newRoom.roomId)) {
    rooms.set(newRoom.roomId, newRoom);
  }
  /**
   * TODO: add error handling (case: the ID already exists)
   * this task is not important in the near future
   * given how unlikely it is to have duplicate room IDs
   */
  return newRoom;
};

export const joinRoom = ({ userId, roomId }: IRoomActs) => {
  /**
   * roomId: ID of the room the user wish to join
   * below, we check if a room with that ID exists
   * if yes, add the userId to the room's list of members (ie. the user joins the room)
   */
  const room = rooms.get(roomId) as IRoom;
  if (!room.members.some((member) => member === userId)) {
    room.members.push(userId);
  }
  const roomInfo = rooms.get(roomId);

  return { userId, roomInfo };
};

export const leaveRoom = ({ userId, roomId }: IRoomActs) => {};
