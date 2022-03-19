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
  return { userId, roomId };
};

export const leaveRoom = ({ userId, roomId }: RoomActs) => {};
