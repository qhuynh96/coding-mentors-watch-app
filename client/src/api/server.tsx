import axios from "axios";
import { SOCKET_URL } from "../config/default";

export const serverAxios = axios.create({
  baseURL: SOCKET_URL,
});
