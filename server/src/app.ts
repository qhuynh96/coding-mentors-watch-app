import createError from "http-errors";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import { Server, Socket } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { RoomEvent } from "./RoomEvent";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "http";
import {
  createRoom,
  getRooms,
  joinRoom,
  RoomActs,
  leaveRoom,
  setVideoOnPlay,
  VideoProps,
} from "./rooms/rooms";

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

// create http server
const server = createServer(app);

// create the socket io server on top of the http server
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// run once the client connects
io.on(RoomEvent.connection, (socket: Socket) => {
  const rooms = getRooms();
  //TODO Khang: change userId : uuid (install uuid)
  socket.emit(RoomEvent.SERVER_ROOMS, { rooms, userId: uuidv4() });

  socket.on(RoomEvent.CREATE_ROOM, ({ roomId, userId }) => {
    // create a new room & append it to the current room array
    const newRoom = createRoom({
      admin: userId,
      members: [userId],
      roomId,
      onPlay: {} as VideoProps,
      videos: [] as string[],
    });

    // join the new room
    socket.join(roomId);

    // broadcast an new Room except
    socket.broadcast.emit(RoomEvent.CREATED_ROOM, { newRoom, userId });
    // send back to room creator
    socket.emit(RoomEvent.CREATED_ROOM, { newRoom, userId });
    // Navigate to new room
    socket.emit(RoomEvent.NAVIGATE, { userId, roomInfo: newRoom });
  });

  socket.on(RoomEvent.JOIN_ROOM, ({ roomId, userId }: RoomActs) => {
    const res = joinRoom({ roomId, userId });
    const { roomInfo } = res;
    socket.join(res.roomInfo.roomId);
    // broadcast when a user connects
    socket.broadcast.emit(RoomEvent.JOINED_ROOM, { userId, roomInfo });
    // send back to participant
    socket.emit(RoomEvent.JOINED_ROOM, { userId, roomInfo });
    // Navigate to the room
    socket.emit(RoomEvent.NAVIGATE, { userId, roomInfo });
  });

  socket.on(RoomEvent.LEAVE_ROOM, ({ roomId, userId }: RoomActs) => {
    leaveRoom({ userId, roomId });
  });
  /**Video on play */
  socket.on(RoomEvent.SELECT_VIDEO, ({ videoOnPlay, roomId }) => {
    const res = setVideoOnPlay(videoOnPlay, roomId);
    console.log(videoOnPlay);
    //broadcast to room except admin
    socket.broadcast.to(roomId).emit(RoomEvent.VIDEO_ONPLAY, res.videoOnPlay);
  });
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/watch-app", ((req, res) => {
  res.status(200).json({
    message: "Successfully connected to ExpressJS server!",
  });
}) as RequestHandler);

// catch 404 and forward to error handler
app.use(((req, res, next) => {
  next(createError(404));
}) as RequestHandler);

// error handler
app.use(((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}) as ErrorRequestHandler);

module.exports = { app: app, server: server };
