import React from "react";

interface IProps {
  playedVideo: string | null;
  url: string;
}
const VideoDetail = (props: IProps) => {
  if (!props.playedVideo) {
    return <div className="ui embed ">...loading</div>;
  }
  return (
    <div className="ui embed ">
      <iframe
        src={props.url}
        title="YouTube video player"
        frameBorder={"0"}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    </div>
  );
};

export default React.memo(VideoDetail);
