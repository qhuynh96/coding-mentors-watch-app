"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveRoom = exports.joinRoom = exports.createRoom = exports.getRooms = exports.setVideoOnPlay = void 0;
var rooms = new Map();
var setVideoOnPlay = function (playingVideo, roomId) {
    var room = rooms.get(roomId);
    room.onPlay = playingVideo;
    return { playingVideo: playingVideo, roomId: roomId };
};
exports.setVideoOnPlay = setVideoOnPlay;
var getRooms = function () {
    return rooms.values();
};
exports.getRooms = getRooms;
var createRoom = function (newRoom) {
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
exports.createRoom = createRoom;
var joinRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
    /**
     * roomId: ID of the room the user wish to join
     * below, we check if a room with that ID exists
     * if yes, add the userId to the room's list of members (ie. the user joins the room)
     */
    var room = rooms.get(roomId);
    if (!room.members.some(function (member) { return member === userId; })) {
        room.members.push(userId);
    }
    var roomInfo = rooms.get(roomId);
    return { userId: userId, roomInfo: roomInfo };
};
exports.joinRoom = joinRoom;
var leaveRoom = function (_a) {
    var userId = _a.userId, roomId = _a.roomId;
};
exports.leaveRoom = leaveRoom;
