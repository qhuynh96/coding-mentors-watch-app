import React, { FormEvent } from "react";
import { StandardTextFieldProps, TextField } from "@mui/material";

interface IProps extends StandardTextFieldProps {
  value: string;
  handleChange: (text: string) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
const SearchBar = ({ value, handleChange, handleSubmit, ...rest }: IProps) => {
  return (
    <form className="ten wide column" onSubmit={handleSubmit}>
      <div className="ui two column grid">
        <div className="fourteen wide column">
          <TextField
            {...rest}
            type="search"
            value={value}
            variant="outlined"
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Youtube URL input"
          />
        </div>
        <div className="two wide column">
          <button className="ui primary fluid button">Submit</button>
        </div>
      </div>
    </form>
  );
};

export default React.memo(SearchBar);
