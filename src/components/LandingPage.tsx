import Link from "next/link";
import React from "react";
import { BiDollar, BiHappyBeaming, BiTimer } from "react-icons/bi";

const LandingPage: React.FC = () => {
  return (
    <div className="flex w-full justify-center items-center flex-col gap-12 h-screen">
      <h2 className="text-4xl font-bold text-center">
        Tell <span className="text-primary">Me!</span>
      </h2>
      <div className="flex flex-col">
        <h1 className="text-2xl text-center font-semibold">Get</h1>
        <ul className="text-2xl flex gap-4">
          <FeedbackWord
            name="Free"
            icon={<BiDollar className="text-emerald-400" size={30} />}
          />
          <FeedbackWord
            name="Fast"
            icon={<BiTimer className="text-cyan-400 mr-1" size={30} />}
          />
          <FeedbackWord
            name="Easy"
            icon={<BiHappyBeaming className="text-violet-400 mr-1" size={30} />}
          />
        </ul>
        <h1 className="text-2xl text-center font-semibold">feedback</h1>
      </div>
      <Link href={{
        pathname: '/signin',
      }} className="btn">
        Signin
      </Link>
    </div>
  );
}

const FeedbackWord: React.FC<{
  name: string;
  icon: React.ReactNode;
}> = (props) => {
  return <li className="flex items-center justify-center">
    {props.icon}
    <p>{props.name}</p>
  </li>
}

export default LandingPage;
