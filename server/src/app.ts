import createError from "http-errors";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import { Server,Socket } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";


import { createServer } from "http";
import { createRoom, getRooms, joinRoom, RoomActs, Room, leaveRoom } from "./rooms/rooms";

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


//Socket Events
export enum RoomEvent  {
  connection= 'connection',
  CREATE_ROOM="CREATE_ROOM",
  JOIN_ROOM="JOIN_ROOM",
  LEAVE_ROOM="LEAVE_ROOM",
  SERVER_ROOMS="SERVER_ROOMS",
  JOINED_ROOM="JOINED_ROOM",
  CREATED_ROOM="CREATED_ROOM"
}

/**Run when client connect */
  io.on(RoomEvent.connection,(socket: Socket)=>{
  const rooms = getRooms()
  socket.emit(RoomEvent.SERVER_ROOMS,{rooms,userId:socket.id})
  /**Create New Room */
    socket.on(RoomEvent.CREATE_ROOM, ({roomId})=>{
    //add a new room to the room list 
    const room = {admin: socket.id, members:[socket.id], roomId}
    const newRoom = createRoom(room)
    //join Room 
    socket.join(roomId)  
    //broadcast an event saying there is a new room
    socket.broadcast.emit(RoomEvent.CREATED_ROOM,newRoom)
    socket.emit(RoomEvent.CREATED_ROOM,newRoom)
    })    

  /**Join room */
    socket.on(RoomEvent.JOIN_ROOM,({roomId}: RoomActs)=>{
    const res = joinRoom({roomId,userId: socket.id})
    socket.join(res.roomId)
    // Broadcast when a user connects 
    socket.broadcast.emit(RoomEvent.JOINED_ROOM, res)
    socket.emit(RoomEvent.JOINED_ROOM, res);
  })

  /**Leave room */
  socket.on(RoomEvent.LEAVE_ROOM,({roomId,userId}: RoomActs)=>{
    leaveRoom({userId,roomId})

  })
})

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
