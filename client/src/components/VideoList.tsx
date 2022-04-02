import React from "react";

interface IProps {
  videos: string[];
}

const VideoList = ({ videos }: IProps) => {
  return (
    <div className="column" style={{ border: "1px solid black" }}>
      {videos.map((item) => (
        <div className="video-item item " key={item}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default React.memo(VideoList);
