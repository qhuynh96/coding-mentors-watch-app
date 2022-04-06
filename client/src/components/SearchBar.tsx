import React, { FormEvent } from "react";
import { Button, StandardTextFieldProps, TextField } from "@mui/material";

interface IProps extends StandardTextFieldProps {
  value: string;
  handleChange: (text: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const SearchBar = ({ value, handleChange, handleSubmit, ...rest }: IProps) => {
  return (
    <form className="twelve wide column" onSubmit={handleSubmit}>
      <div
        className="ui two column grid"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <div className="fourteen wide column">
          <TextField
            {...rest}
            sx={{
              input: {
                padding: "10px",
              },
            }}
            type="search"
            value={value}
            variant="filled"
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Youtube URL input"
          />
        </div>
        <div className="two wide column">
          <Button
            sx={{
              width: "100px",
              color: "black",
              backgroundColor: "lightgray",
            }}
          >
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};

export default React.memo(SearchBar);
