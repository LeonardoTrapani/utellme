import React from "react";
import Link from "next/link";
import LightThemeLogo from "../assets/utellme-logo-light.svg"
import DarkThemeLogo from "../assets/utellme-logo-dark.svg"
import { useIsDarkMode } from "~/utils/hooks";

export const UTellMeComponentButton: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
}> = (props) => {
  return (
    <Link
      className={`select-none cursor-pointer ${props.isBig ? 'text-2xl' : 'text-xl'} cursor-pointer`}
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
  const isDarkThemeVar = useIsDarkMode();
  return (
    <div
      className={`object-contain ${props.isBig ? 'w-48 mt-8' : props.isMedium ? 'w-28 mt-5' : 'w-12 mt-2'}`}
    >
      {

        isDarkThemeVar ? <DarkThemeLogo /> : <LightThemeLogo />
      }
    </div>
  )
}
