import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { type Session } from "next-auth";

const AvatarDropdown: React.FC<{
  children: React.ReactNode
}> = (props) => {
  const { data: sessionData } = useSession();
  if (!sessionData) {
    return <></>
  }
  return (
    <div className="dropdown dropdown-end" >
      <label tabIndex={0} className="hover:cursor-pointer m-1">
        <AvatarContent sessionData={sessionData} />
      </label>
      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 dark:border dark:border-zinc-700">
        {props.children}
      </ul>
    </div >
  )
}

export const AvatarContent: React.FC<{
  isBig?: boolean;
  sessionData: Session | null;
}> = (props) => {

  if (props.sessionData?.user.image) return (
    <div className="avatar">
      <div className={`rounded-full overflow-hidden ${props.isBig ? 'w-20' : 'w-11'}`}>
        <Image
          src={props.sessionData.user.image}
          alt={`Tell Me Image Profile of ${props.sessionData.user.name || "Unknown"}`}
          height={props.isBig ? 80 : 44}
          width={props.isBig ? 80 : 44}
          style={{
            objectFit: "cover",
            borderRadius: "1000px"
          }}
        />
      </div>
    </div>
  )

  return (
    <div className="avatar placeholder">
      <div className="bg-neutral-focus text-neutral-content rounded-full w-11">
        <span>{(props.sessionData?.user.name || "?")[0]}</span>
      </div>
    </div>
  )
}
export default AvatarDropdown;
