import React from "react";

interface IProps {
  video: string[];
}

const VideoList = ({ video }: IProps) => {
  return (
    <div className="column" style={{ border: "1px solid black" }}>
      {video.map((item) => (
        <div className="video-item item " key={item}>
          {item}
        </div>
      ))}
    </div>
  );
};

export default React.memo(VideoList);
