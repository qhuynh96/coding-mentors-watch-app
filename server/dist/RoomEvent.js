"use strict";
/**
 * ! Both files RoomEvent.ts in the client and the server must be identical
 * before committing any change to this file, in the project directory, please run:
 * git diff --no-index client/src/RoomEvent.ts server/src/RoomEvent.ts
 * and make sure that there is no difference
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomEvent = void 0;
var RoomEvent;
(function (RoomEvent) {
    RoomEvent["connection"] = "connection";
    RoomEvent["CREATE_ROOM"] = "CREATE_ROOM";
    RoomEvent["JOIN_ROOM"] = "JOIN_ROOM";
    RoomEvent["LEAVE_ROOM"] = "LEAVE_ROOM";
    RoomEvent["SERVER_ROOMS"] = "SERVER_ROOMS";
    RoomEvent["JOINED_ROOM"] = "JOINED_ROOM";
    RoomEvent["CREATED_ROOM"] = "CREATED_ROOM";
    RoomEvent["SELECT_VIDEO"] = "SELECT_VIDEO";
    RoomEvent["VIDEO_ONPLAY"] = "VIDEO_ONPLAY";
    RoomEvent["VIDEO_UPDATING"] = "VIDEO_UPDATING";
    RoomEvent["VIDEO_UPDATED"] = "VIDEO_UPDATED";
})(RoomEvent = exports.RoomEvent || (exports.RoomEvent = {}));
