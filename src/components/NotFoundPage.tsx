import React from "react";
import { UTellMeComponentButton } from "./UTellMeComponent";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col gap-2">
        <div className="divider" />
        <div className="flex m-auto">
          <UTellMeComponentButton isMedium />
        </div>
        <h1 className="text-9xl text-center">404</h1>
        <h1 className="text-2xl text-center">page not found</h1>
        <div className="divider" />
      </div>
    </div>
  );
}

export default NotFoundPage;
