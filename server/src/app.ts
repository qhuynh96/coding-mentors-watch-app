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
  IRoomActs,
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
  socket.emit(RoomEvent.SERVER_ROOMS, { rooms });

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
    //welcome to the room
    const msg = { sender: "server", text: `Welcome to Watch-app room` };
    socket.emit(RoomEvent.CLIENT_GET_MSG, { msg });
    // broadcast an new Room except
    socket.broadcast.emit(RoomEvent.CREATED_ROOM, { newRoom, userId });
    // send back to room creator
    socket.emit(RoomEvent.CREATED_ROOM, { newRoom, userId });
  });

  socket.on(RoomEvent.JOIN_ROOM, ({ roomId, userId }: IRoomActs) => {
    const res = joinRoom({ roomId, userId });
    const { roomInfo } = res;
    socket.join(roomId);
    //welcome to the room
    const msg = { sender: "server", text: `Welcome to Watch-app room` };
    socket.emit(RoomEvent.CLIENT_GET_MSG, { msg });
    // broadcast when a user connects
    socket.broadcast.emit(RoomEvent.JOINED_ROOM, { userId, roomInfo });
    // send back to participant
    socket.emit(RoomEvent.JOINED_ROOM, { userId, roomInfo });
  });

  socket.on(RoomEvent.LEAVE_ROOM, ({ roomId, userId }: IRoomActs) => {
    leaveRoom({ userId, roomId });
  });

  socket.on(RoomEvent.CLIENT_SEND_MSG, ({ roomId, msg }) => {
    /**send Msg to other in the room */
    socket.broadcast.to(roomId).emit(RoomEvent.CLIENT_GET_MSG, { msg });
  });
  /**Video on play */
  socket.on(RoomEvent.SELECT_VIDEO, ({ playingVideo, roomId }) => {
    const res = setVideoOnPlay(playingVideo, roomId);
    //broadcast video to roomID except sender
    socket.broadcast.to(roomId).emit(RoomEvent.VIDEO_ONPLAY, { playingVideo });
  });
  socket.on(RoomEvent.VIDEO_UPDATING, ({ videoUpdate, roomId }) => {
    const res = setVideoOnPlay(videoUpdate, roomId);
    //broadcast video to roomID except sender
    socket.broadcast
      .to(roomId)
      .emit(RoomEvent.VIDEO_UPDATED, { updatedVideo: videoUpdate });
  });
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.get("/watch-app/user", (async (req, res) => {
  try {
    const userId = await uuidv4();
    res.status(200).json(userId);
  } catch (err) {
    throw err;
  }
}) as RequestHandler);

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
