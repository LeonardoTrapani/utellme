import React from "react";
import Link from "next/link";
import Image from "next/image";
import LightThemeLogo from "../assets/uTellMe logo-light.png"
import DarkThemeLogo from "../assets/uTellMe logo-dark.png"
import { isDarkTheme } from "~/utils/functions";

export const UTellMeComponentButton: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
}> = (props) => {
  return (
    <Link
      className={`select-none cursor-pointer ${props.isBig ? 'text-2xl' : 'text-xl'}`}
      href={{
        pathname: '/'
      }}
    >
      <UTellMeComponent isBig={props.isBig} isMedium={props.isMedium} />
    </Link>
  )
}
export const UTellMeComponent: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
}> = (props) => {
  const isDarkThemeVar = isDarkTheme();
  return (
    <Image alt="uTellMe logo" src={isDarkThemeVar ? DarkThemeLogo : LightThemeLogo}
      className={`object-contain ${props.isBig ? 'w-64' : props.isMedium ? 'w-36' : 'w-20'}`} />
  )
}
