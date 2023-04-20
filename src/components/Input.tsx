import React, { useEffect, useRef } from "react";

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
  inputClassName?: string;
  id?: string;
  borderHidden?: boolean;
  isGhost?: boolean;
  autoResize?: boolean;
  initialLength?: number;
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
          size={(props.autoResize) ? props.value?.length : props.initialLength || undefined}
          onKeyDown={(e) => {
            if (e.key === "Enter" && props.onSubmit) {
              props.onSubmit(e);
            }
          }}
          className={`
            input ${!props.borderHidden || !props.isGhost ? 'input-bordered' : ''} placeholder:text-gray-500 w-full ${props.isError ? "input-error" : ""} ${props.maxLength && (props.maxLength <= currentLength) ? "input-warning" : ""} ${props.inputClassName || ""} ${props.isGhost ? 'font-bold input-ghost b-0 outline-none outline-0 focus:outline-0 b-none bg-red p-0 m-0' : ''}
          `}
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

export const TextArea: React.FC<{
  placeholder?: string;
  className?: string;
  onChange?: (value: string) => void;
  value: string;
  autoAdjustHeight?: boolean;
  hasError?: boolean;
  initialValue: string;
  rows?: number;
  id?: string;
  bordered?: boolean;
  onSubmit?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isGhost?: boolean;
}> = (props) => {
  const textAreaElement = (document && props.autoAdjustHeight) ? document.getElementById(props.id || "") as HTMLTextAreaElement : null;
  const descriptionTextAreaRef = useRef<HTMLTextAreaElement>(textAreaElement);

  useEffect(() => {
    if (!props.autoAdjustHeight || !descriptionTextAreaRef) return;
    if (descriptionTextAreaRef.current) {
      descriptionTextAreaRef.current.style.height = "0px"
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      descriptionTextAreaRef.current.style.height = "0px";
      const scrollHeight = descriptionTextAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      if (scrollHeight < 112) {
        descriptionTextAreaRef.current.style.height = `${scrollHeight}` + "px";
      } else {
        descriptionTextAreaRef.current.style.height = "112px";
      }
    }
  }, [props.autoAdjustHeight, descriptionTextAreaRef, props.value]);

  return (
    <textarea
      placeholder="Description"
      className={`${props.autoAdjustHeight ? 'overflow-hidden' : ''} textarea ${props.bordered ? 'textarea-bordered' : ''} textarea-md w-full placeholder:text-gray-500 ${props.hasError ? "border-red-400 textarea-error" : ""} ${props.isGhost ? 'input input-ghost w-full p-0 m-0 outline-none b-0 outline-0 focus:outline-0 placeholder-gray-500 italic none resize-none overflow-hidden text-lg' : ''} ${props.className || ""} `}
      ref={descriptionTextAreaRef}
      onChange={(e) => { if (props.onChange) props.onChange(e.target.value) }}
      value={props.value}
      rows={props.rows || 4}
      onKeyDown={(e) => {
        if (e.key === "Enter" && props.onSubmit) {
          props.onSubmit(e);
        }
      }}
      id={props.id}
    />
  )
};
export default Input;
