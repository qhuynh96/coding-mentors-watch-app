import axios from "axios";

export default axios.create({
  baseURL: "https://www.googleapis.com/youtube/v3",
  params: {
    part: "snippet",
    type: "video",
    maxResult: 5,
    key: "AIzaSyBf-mBYkmKoyfGEBInvrtMxeZuMQBQGiho",
  },
});
