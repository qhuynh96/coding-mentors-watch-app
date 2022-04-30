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

export const updateVideoOnPlay = async (
  playingVideo: IVideo,
  roomId: string
) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId) as IRoom;
    room.onPlay = playingVideo;
    return room;
  } else {
    throw createError(404);
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
    throw createError(404);
  }
};

export const getRooms = () => {
  if (rooms) {
    const data = Array.from(rooms.values());
    return data;
  } else {
    throw createError(404);
  }
};

export const findRoom = (roomId: string) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    return room;
  } else {
    throw createError(404);
  }
};

export const createRoom = (newRoom: IRoom) => {
  if (!rooms.has(newRoom.roomId)) {
    rooms.set(newRoom.roomId, newRoom);
    return newRoom;
  } else {
    throw createError(404);
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
    throw createError(404);
  }
};

export const leaveRoom = ({ userId, roomId }: IRoomActs) => {
  //TODO: Change roomAdmin if admin left
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId) as IRoom;
    if (room.members.some((member) => member === userId)) {
      room.members.splice(room.members.indexOf(userId), 1);
    }
    const roomInfo = rooms.get(roomId);
    return roomInfo;
  } else {
    throw createError(404);
  }
};
