import React from "react";
import Link from "next/link";

export const TellMeComponent: React.FC<{
  isBig?: boolean;
}>= (props) => {
  return (
    <Link
      className={`font-bold text-xl select-none cursor-pointer ${props.isBig ? 'text-4xl' : ''}`}
      href={{
        pathname: '/'
      }}
    >
      TELL&nbsp;<span className="text-primary">ME!</span>
    </Link>
  )

}
