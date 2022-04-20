let SOCKET_URL: string;

switch (process.env.NODE_ENV) {
  case "development":
    SOCKET_URL = "http://localhost:5000";
    break;
  case "production":
    SOCKET_URL = "http://cmwa.khoituan.com:5000";
    break;
}

export { SOCKET_URL };
