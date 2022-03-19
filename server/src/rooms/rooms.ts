export interface Room {
  admin: string;
  roomId: string;
  members: string[];
}

export interface RoomActs {
  userId: string;
  roomId: string;
}

const rooms: Array<Room> = [];
//Get rooms
export const getRooms = () => {
  return rooms;
};
//Create room
export const createRoom = (room: Room) => {
  if (!rooms.some((r) => r.roomId === room.roomId)) {
    rooms.push(room);
  }
  return room;
};

//Join room
export const joinRoom = ({ userId, roomId }: RoomActs) => {
  rooms.map((room) =>
    room.roomId === roomId ? room.members.push(userId) : null
  );
  const res = { userId, roomId };
  return res;
};

//Leave room

export const leaveRoom = ({ userId, roomId }: RoomActs) => {};
