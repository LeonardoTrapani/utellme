import React from "react";
import Link from "next/link";
import LightThemeLogo from "../assets/utellme-logo-light.svg"
import DarkThemeLogo from "../assets/utellme-logo-dark.svg"
import { useIsDarkMode } from "~/utils/hooks";

export const UTellMeComponentButton: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
  hasText?: boolean;
}> = (props) => {
  return (
    <Link
      className={`select-none cursor-pointer ${props.isBig ? 'text-2xl' : 'text-xl'} cursor-pointer btn-ghost px-1 m-0 rounded-xl transition-all`}
      href={{
        pathname: '/'
      }}
    >
      <UTellMeComponent isBig={props.isBig} isMedium={props.isMedium} hasText={props.hasText} />
    </Link>
  )
}

export const UTellMeComponent: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
  hasText?: boolean;
}> = (props) => {
  const isDarkThemeVar = useIsDarkMode();
  return (
    <div className="flex items-center">
      <div
        className={`object-contain ${props.isBig ? 'w-96 mt-8' : props.isMedium ? 'w-20 mt-5' : 'w-11 mt-2'}`}
      >
        {

          isDarkThemeVar ? <DarkThemeLogo /> : <LightThemeLogo />
        }
      </div>
      {
        props.hasText &&
        <div className={`font-bold ${props.isBig ? 'mt-4 text-6xl' : props.isMedium ? 'mt-1 text-4xl' : 'text-xl'}`}>
          UTellMe
        </div>
      }
    </div>
  )
}
