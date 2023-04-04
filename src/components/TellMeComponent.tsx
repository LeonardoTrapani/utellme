import React from "react";
import Link from "next/link";

export const TellMeComponent = () => {
  return (

    <Link
      className="font-bold text-xl select-none cursor-pointer"
      href={{
        pathname: '/'
      }}
    >
      TELL&nbsp;<span className="text-primary">ME!</span>
    </Link>
  )

}
