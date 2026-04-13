import { io } from "socket.io-client";
const socketUrl = new URL(import.meta.env.VITE_SERVER_BASEURL)
export const socket = io(socketUrl.origin, {
  withCredentials: true,
  autoConnect: false,
});