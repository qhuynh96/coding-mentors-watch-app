import createError from "http-errors";

export interface IVideo {
  url: string; // https
  playing: boolean; // true ? play : pause
  latestUpdateAt: number; // (second) start, seekTo, play & pause
  progress: number; // (second) video progress at latestUpdate
}

export interface IRoom {
  admin: string;
  roomId: string;
  members: string[];
  onPlay: IVideo;
  videos: string[];
}

export interface IRoomActs {
  userId: string;
  roomId: string;
}

const rooms = new Map<string, IRoom>();

export const setVideoOnPlay = (playingVideo: IVideo, roomId: string) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId) as IRoom;
    room.onPlay = playingVideo;
    const roomInfo = rooms.get(roomId);
    return roomInfo;
  } else {
    return createError(404);
  }
};

export const addVideo = (url: string, roomId: string) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    if (!room?.videos.some((v) => v === url)) {
      room?.videos.push(url);
    }
    return room;
  } else {
    return createError(404);
  }
};

export const getRooms = () => {
  if (rooms) {
    const data = Array.from(rooms.values());
    return data;
  } else {
    return createError(404);
  }
};

export const findRoom = (roomId: string) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    return room;
  } else {
    return createError(404);
  }
};

export const createRoom = (newRoom: IRoom) => {
  // check if the new room's ID does not already exist
  if (!rooms.has(newRoom.roomId)) {
    rooms.set(newRoom.roomId, newRoom);
    return newRoom;
  } else {
    return createError(404);
  }
};

export const joinRoom = ({ userId, roomId }: IRoomActs) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId) as IRoom;
    if (!room.members.some((member) => member === userId)) {
      room.members.push(userId);
    }
    const roomInfo = rooms.get(roomId);
    return roomInfo;
  } else {
    return createError(404);
  }
};

export const leaveRoom = ({ userId, roomId }: IRoomActs) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId) as IRoom;
    if (room.members.some((member) => member === userId)) {
      room.members.splice(room.members.indexOf(userId), 1);
    }
    const roomInfo = rooms.get(roomId);
    return roomInfo;
  } else {
    return createError(404);
  }
};
