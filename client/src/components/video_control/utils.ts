export const formatedProgress = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds <= 9 ? `0${seconds}` : seconds}`;
};
