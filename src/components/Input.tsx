import React from "react";

const Input: React.FC<{
  name: string;
  placeholder: string;
  optional?: boolean;
  onChange: (value: string) => void;
  value?: string;
  isError?: boolean;
  isDisabled?: boolean;
  maxLength?: number;
  labelDisabled?: boolean;
  type?: React.HTMLInputTypeAttribute;
  autoFocus?: boolean;
  onSubmit?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}> = (props) => {
  const [currentLength, setCurrentLength] = React.useState(0);
  return (
    <div className={props.className}>
      <div className="flex items-center justify-between">
        {
          ((props.maxLength) && (props.maxLength - currentLength < 15))
            ?
            <label className="text-start text-sm italic text-gray-500 ml-2 select-none">
              {currentLength}/{props.maxLength}
            </label>
            :
            <div></div>
        }
        {props.optional && <label className="text-end text-sm italic text-gray-500 mr-2 select-none">optional</label>}
      </div>
      <label className={!props.labelDisabled ? "input-group" : ""}>
        {
          !props.labelDisabled && <span>{props.name}</span>
        }
        <input
          id={props.id}
          type={props.type || "text"}
          placeholder={props.placeholder}
          autoFocus={props.autoFocus}
          onSubmit={props.onSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.onSubmit) {
              props.onSubmit(e);
            }
          }}
          className={`input input-bordered placeholder:text-gray-500 w-full ${props.isError ? "input-error" : ""} ${props.maxLength && (props.maxLength <= currentLength) ? "input-warning" : ""}`}
          onChange={(e) => {
            props.onChange(e.target.value);
            setCurrentLength(e.target.value.length);
          }}
          value={props.value}
          disabled={props.isDisabled}
          maxLength={props.maxLength}
        />
      </label>
    </div>
  )
}

export default Input;
