import React from "react";

export const SwitchComponent: React.FC<{
  activeFirst: boolean;
  first: React.ReactNode;
  second: React.ReactNode;
  onSwitch: () => void;
}> = (props) => {
  return (
    <button onClick={props.onSwitch}>
      {props.activeFirst ? props.first : props.second}
    </button>
  )
}

