import React from "react";
import Link from "next/link";
import Image from "next/image";
import { isDarkMode } from "~/utils/hooks";

export const UTellMeComponentButton: React.FC<{
  isBig?: boolean;
  isMedium?: boolean;
  hasText?: boolean;
}> = (props) => {
  return (
    <Link
      className={
        `select-none cursor-pointer btn btn-ghost px-1 m-0 rounded-xl transition-all normal-case`
      }
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
  const isDarkThemeVar = isDarkMode();
  return (
    <div className="flex items-center">
      {

        isDarkThemeVar ?
          <Image
            src="/assets/utellme-logo-dark.svg"
            alt="utellme logo"
            className={`${props.isBig ? 'w-96' : props.isMedium ? 'w-20' : 'w-11'} h-auto`}
            width={0}
            height={0}
          />
          :
          <Image
            src="/assets/utellme-logo-light.svg"
            alt="utellme logo"
            className={`${props.isBig ? 'w-96 mt-8' : props.isMedium ? 'w-20 mt-5' : 'w-11 mt-2'} h-auto`}
            width={0}
            height={0}
          />

      }
      {
        props.hasText &&
        <div className={`font-bold ${props.isBig ? 'mt-4 text-6xl' : props.isMedium ? 'mt-1 text-4xl' : 'text-xl'}`}>
          UTellMe
        </div>
      }
    </div>
  )
}
