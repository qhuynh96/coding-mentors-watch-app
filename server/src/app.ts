import createError from "http-errors";
import express, { RequestHandler, ErrorRequestHandler } from "express";
import { Server } from "socket.io";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { createServer } from "http";

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

io.on("connection", () => {
  console.log("a connection established");
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
