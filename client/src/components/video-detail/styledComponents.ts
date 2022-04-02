import styled from "@emotion/styled";

export const VideoControlWrapper = styled("div")({
  padding: "0 15px",
  position: "absolute",
  width: "100%",
  bottom: 0,
  zIndex: 5,
  backgroundColor: "rgba(239,239,239,0.5)",
  backdropFilter: "blur(5px)",
  opacity: "0",
  ":hover": {
    opacity: "1",
  },
});
