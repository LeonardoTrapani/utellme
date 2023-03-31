import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
const AvatarDropdown: React.FC<{
  children: React.ReactNode
}> = (props) => {
  return <div className="dropdown dropdown-end">
    <label tabIndex={0} className="hover:cursor-pointer m-1">
      <AvatarContent />
    </label>
    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
      {props.children}
    </ul>
  </div>
  //return <AvatarContent />
}

const AvatarContent: React.FC = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) {
    return <p>We shouldn't be here</p>
  }

  if (sessionData?.user.image) return (
    <div className="avatar">
      <div className="w-11 rounded-full overflow-hidden">
        <Image
          src={sessionData.user.image}
          alt={`Tell Me Image Profile of ${sessionData.user.name}`}
          fill
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
        <span>{(sessionData.user.name || "?")[0]}</span>
      </div>
    </div>
  )
}
export default AvatarDropdown;
