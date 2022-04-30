import React from "react";
import "./videoList.css";

interface IProps {
  videos: string[];
}

const VideoList = ({ videos }: IProps) => {
  function getYoutubeThumbnailUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  return (
    <div className="video-list-container">
      <h3 className="video-list-title" style={{ margin: "5px" }}>
        Upcoming videos
      </h3>
      <div className={`video-list ${videos.length < 1 && "empty"}`}>
        {videos.map((item) => (
          //TODO: Play next video, onClick
          <div className="video-item" key={item}>
            <img src={getYoutubeThumbnailUrl(item)} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(VideoList);
