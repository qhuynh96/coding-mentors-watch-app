import { useCallback, useState, useRef } from "react";
import { IVideo } from "../context/RoomsContext";
import screenful from "screenfull";

export interface IVideoFigures {
  playing: boolean;
  playedSeconds: number | number[]; //second
  volume: number;
  duration: number; //video duration (second)
  isSeekingTo: boolean; //true && move to arbitrary point
  muted: boolean;
}

type UpdateVideo = (videoUpdate: IVideo) => void;

type ChangingState = {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
};

export const useVideoControl = (
  defaultFigures: IVideoFigures,
  playingVideo: IVideo,
  updateVideo: UpdateVideo
) => {
  const [videoFigures, setVideoFigures] = useState<IVideoFigures>(defaultFigures);
  const playerRef = useRef<any>(null);
  const videoContainerRef = useRef<any>();

  const handleMute = useCallback(() => {
    setVideoFigures((prev) => ({
      ...prev,
      muted: !prev.muted,
    }));
  }, [setVideoFigures]);

  const handleVolumeChange = useCallback(
    (e: Event, newValue: number | number[]) => {
      setVideoFigures((prev) => ({
        ...prev,
        volume: prev.muted ? 0 : (newValue as number) ,
        muted: newValue === 0 ? true : false,
      }));
    },
    [setVideoFigures]
  );

  const handleVolumeMouseUp = useCallback(
    (
      e: Event | React.SyntheticEvent<Element, Event>,
      newValue: number | number[]
    ) => {
      setVideoFigures((prev) => ({
        ...prev,
        volume: prev.muted ? 0 : (newValue as number) ,
        muted: newValue === 0 ? true : false,
      }));
    },
    [setVideoFigures]
  );

  const handleIsSeekingTo = useCallback(() => {
    setVideoFigures({ ...videoFigures, isSeekingTo: true });
  }, [setVideoFigures]);

  const handleSeekToChange = useCallback(
    (e: Event, newValue: number | number[]) => {
      setVideoFigures({ ...videoFigures, playedSeconds: newValue as number });
    },
    [setVideoFigures]
  );

  const handleSeekToMouseUp = useCallback(
    (
      e: Event | React.SyntheticEvent<Element, Event>,
      newValue: number | number[]
    ) => {
      playerRef.current && playerRef.current.seekTo(newValue as number);
      setVideoFigures({
        ...videoFigures,
        playedSeconds: newValue as number,
        isSeekingTo: false,
      });
      const videoUpdate = {
        ...playingVideo,
        progress: newValue as number,
        latestUpdateAt: new Date().getTime() / 1000,
      };
      updateVideo(videoUpdate);
    },
    [playingVideo, updateVideo, setVideoFigures]
  );

  const handlePlayPause = useCallback(() => {
    const progress = playerRef.current!.getCurrentTime();
    const videoUpdate = {
      ...playingVideo,
      progress: progress,
      latestUpdateAt: new Date().getTime() / 1000,
      playing: !playingVideo.playing,
    };
    updateVideo(videoUpdate);
  }, [playingVideo, setVideoFigures]);

  const handleProgress = useCallback(
    (changingState: ChangingState) => {
      if (!videoFigures.isSeekingTo) {
        setVideoFigures({
          ...videoFigures,
          ...changingState,
        });
      }
    },
    [setVideoFigures]
  );

  const handleFullScreen = useCallback(() => {
    videoContainerRef.current && screenful.toggle(videoContainerRef.current);
  }, []);
  return {
    videoFigures,
    playerRef,
    videoContainerRef,
    handleMute,
    handleVolumeChange,
    handleVolumeMouseUp,
    handleIsSeekingTo,
    handleSeekToChange,
    handleSeekToMouseUp,
    handlePlayPause,
    handleProgress,
    handleFullScreen,
  };
};
