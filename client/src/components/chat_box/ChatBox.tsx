import { IconButton, InputAdornment, TextField } from "@mui/material";
import { ChatBoxContainer, ChatInput, MsgContainer } from "./styledComponents";
import React from "react";
import { Send } from "@mui/icons-material";

const ChatBox = () => {
  return (
    <ChatBoxContainer>
      <MsgContainer></MsgContainer>
      <div className="ui row">
        <ChatInput
          variant="filled"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton sx={{ cursor: "pointer" }}>
                  <Send color="disabled" />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>
    </ChatBoxContainer>
  );
};

export default ChatBox;
