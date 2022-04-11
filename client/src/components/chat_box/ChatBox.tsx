import { IconButton, InputAdornment } from "@mui/material";
import {
  ChatBoxContainer,
  ChatInput,
  MsgContainer,
  StyledMsg,
} from "./styledComponents";
import { ChangeEvent } from "react";
import { Send } from "@mui/icons-material";
import { IMsg } from "../../pages/NewRoom";

interface IProps {
  userId: string;
  messages: IMsg[] | undefined;
  text: string;
  sendMsg: (msg: string) => void;
  setText: (e: ChangeEvent<HTMLInputElement>) => void;
}
const ChatBox = ({ messages, text, setText, sendMsg, userId }: IProps) => {
  return (
    <ChatBoxContainer>
      <MsgContainer>
        {messages?.map((m, i) => {
          return (
            <StyledMsg
              key={i}
              className={userId === m.sender ? "myMsg" : undefined}
            >
              {m.text}
            </StyledMsg>
          );
        })}
      </MsgContainer>
      <div className="ui row">
        <ChatInput
          value={text}
          onChange={setText}
          variant="filled"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => sendMsg(text)}
                  sx={{
                    ":hover": { backgroundColor: "white" },
                    cursor: "pointer",
                  }}
                >
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
