import React from "react";

const Input: React.FC<{
  name: string;
  placeholder: string;
  optional?: boolean;
  onChange: (value: string) => void;
  value?: string;
  isError?: boolean;
  isDisabled?: boolean;
}> = (props) => {
  return (
    <div>
      {props.optional && <label className="flex justify-end text-end text-sm italic text-gray-500 mr-2 select-none">optional</label>}
      <label className="input-group">
        <span>{props.name}</span>
        <input
          type="text"
          placeholder={props.placeholder}
          className={`input input-bordered placeholder:text-gray-500 w-full ${props.isError ? "input-error" : ""}`}
          onChange={(e) => props.onChange(e.target.value)}
          value={props.value}
          disabled={props.isDisabled}
        />
      </label>
    </div>
  )
}

export default Input;
