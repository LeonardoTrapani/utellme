import React from "react";
import Link from "next/link";

export const TellMeComponentButton: React.FC<{
  isBig?: boolean;
}> = (props) => {
  return (
    <Link
      className={`font-bold select-none cursor-pointer ${props.isBig ? 'text-2xl' : 'text-xl'}`}
      href={{
        pathname: '/'
      }}
    >
      TELL&nbsp;<span className="text-primary">ME!</span>
    </Link>
  )
}
export const TellMeComponent: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
}> = (props) => {
  return (
    <h2
      className={`font-bold select-none text-2xl ${props.isBig ? 'text-4xl' : ''} ${props.isMedium ? 'text-3xl' : ''}`}
    >
      TELL&nbsp;<span className="text-primary">ME!</span>
    </h2>
  )
}
