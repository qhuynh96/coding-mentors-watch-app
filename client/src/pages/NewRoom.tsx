import { FC, FormEvent, useState } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import VideoDetail from "../components/VideoDetail";
import VideoList from "../components/VideoList";

type Props = {
  socket: Socket;
};

const BASE_YOUTUBE_API_URL = "https://www.youtube.com/embed/";

const NewRoom: FC<Props> = ({ socket }) => {
  // TODO: define other socket events (for watching Youtube together/chatting)

  const { roomID } = useParams();
  const [search, setSearch] = useState<string>("");
  const [video, setVideo] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const url = `${BASE_YOUTUBE_API_URL}${selectedVideo}`;

  let searchId: string;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    searchId = search.includes("&")
      ? search.split("=")[1].split("&")[0]
      : search.split("=")[1];

    if (!selectedVideo) {
      setSelectedVideo(searchId);
    } else {
      setVideo([...video, searchId]);
    }
    setSearch("");
  };

  return (
    <div className="ui segment">
      <div className="ui grid">
        <div className="ui row">
          <SearchBar
            handleChange={setSearch}
            className="ui fluid input"
            handleSubmit={handleSubmit}
            value={search}
          />
          <div className="six wide column">
            <button className="ui  fluid  button">Menu</button>
          </div>
        </div>
        <div className="ui row">
          <form className="ten wide column">
            <VideoDetail playedVideo={selectedVideo} url={url} />
          </form>
          <div
            className="four wide column"
            style={{ border: "1px solid black" }}
          >
            <h3>The list of participants</h3>
          </div>
        </div>
        <div className="ui row ">
          <div className="ten wide column">
            <div className="column">
              <h1>Upcoming videos: </h1>
            </div>
          </div>
          <div className="ten wide column">
            <div className="ui grid column">
              <div className="five column row">
                <VideoList video={video} />
              </div>
            </div>
          </div>
          <div
            className="four wide column"
            style={{ border: "1px solid black" }}
          >
            <h3>Chat box (room {roomID})</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;
