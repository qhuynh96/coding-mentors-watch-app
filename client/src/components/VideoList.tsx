import React from "react";
import "./videoList.css"

interface IProps {
  videos: string[];
}

const VideoList = ({ video }: IProps) => {
  function getYoutubeThumbnailUrl(videoId: string) {
    return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  return (
    <div className="video-list" style={{ border: "1px solid black" }}>
      {video.map((item) => (
        <div className="video-item" key={item}>
          <img src={getYoutubeThumbnailUrl(item)} alt="" /> 

        </div>
      ))}
    </div>
  );
};

export default React.memo(VideoList);
