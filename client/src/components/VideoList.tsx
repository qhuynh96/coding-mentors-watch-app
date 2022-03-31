import React from "react";
import "./videoList.css"

interface IProps {
  video: string[];
}

const VideoList = ({ video }: IProps) => {
  return (
    <div className="video-list" style={{ border: "1px solid black" }}>
      {video.map((item) => (
        <div className="video-item" key={item}>
          <img src={`https://img.youtube.com/vi/${item}/sddefault.jpg`} alt="" /> 
        </div>
      ))}
    </div>
  );
};

export default React.memo(VideoList);
