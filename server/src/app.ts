const createError = require("http-errors");
const express = require("express");
import { RequestHandler, ErrorRequestHandler } from "express";
const socket =  require ("./socket.ts");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const http = require('http')
const {Server} = require('socket.io')
const app = express();

app.use(
  cors({
    origin: "*",
  })
);

//Set up socket
const server = http.createServer(app)
const io = new Server(server,{
  cors: {
    origin:"*"
  }
})
socket({io})

//Socket Connection

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


app.get("/watch-app", ((req, res) => { 
  res.status(200).json({
    message: "Successfully connected to ExpressJS server!",
  });
}) as RequestHandler );

io.on("connection", (socket: any) => {
  console.log(socket)
});

// catch 404 and forward to error handler
app.use(((req, res, next) => {
  next(createError(404));
}) as RequestHandler );

// error handler
app.use(((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
}) as ErrorRequestHandler );

module.exports = app;
