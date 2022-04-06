import styled from "@emotion/styled";
import { TextField } from "@mui/material";

export const ChatBoxContainer = styled("div")({
  padding: "5px",
  height: "100%",
  backgroundColor: "rgba(239,239,239,1)",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
});

export const MsgContainer = styled("div")({
  borderRadius: "5px",
  backgroundColor: "white",
  height: "100%",
  marginBottom: "5px",
});

export const ChatInput = styled(TextField)({
  "& .MuiFormControl-root": {
    backgroundColor: "white",
  },
  "& .MuiFilledInput-root": {
    "& :focus": {
      backgroundColor: "white",
    },
    backgroundColor: "white",
  },
  width: "100%",
});
