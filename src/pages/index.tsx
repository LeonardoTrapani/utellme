import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";
import { useState } from "react";
import { Feedback, type Project } from "@prisma/client";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const isSignedIn = !!sessionData

  return (
    <>
      <Head>
        <title>Tell Me</title>
        <meta name="description" content="a web app to get feedback" />
        <link rel='icon' href="/favicon.ico" />
      </Head>
      <main>
        {isSignedIn ? <MainPageContent /> : <LoginPage />}
      </main>
    </>
  );
};

export default Home;

const MainPageContent: React.FC = () => {
  const { data: projectsData } = api.projects.getAll.useQuery();
  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const onProjectPress = (i: number) => {
    setSelectedProjectIndex(i);
  }
  return (
    <div>
      <Navbar />
      <body className="flex items-stretch p-4">
        <ul className="menu bg-base-200 w-56 p-2 rounded-box">
          <li><button className="btn btn-primary mb-2">New Project</button></li>
          {
            projectsData?.map((project, i) => {
              return <ProjectComponent key={i} project={project} isActive={selectedProjectIndex === i} onPress={onProjectPress} index={i} />
            })
          }
        </ul>
        <ul className="">
          {
            projectsData?.[selectedProjectIndex]?.feedbacks.map((feedback) => {
              return <FeedbackComponent key={feedback.id} feedback={feedback} />
            })
          }
        </ul>
      </body>
    </div>
  )
}

const ProjectComponent: React.FC<{
  project: Project,
  isActive: boolean, onPress: (i: number) => void; index: number
}> = (props) => {
  // className={`${props.isActive ? "btn-accent text-neutral-200" : ""} hover:bg-accent hover:opacity-90 hover:text-neutral-200`} to put in a
  return (
    <li key={props.project.id}>
      <a
        className={`${props.isActive ? "btn-accent text-neutral-200" : ""} active:bg-accent`}
        onClick={() => props.onPress(props.index)}
      >
        {props.project.name}
      </a>
    </li>
  )
}

const FeedbackComponent: React.FC<{ feedback: Feedback }> = (props) => {
  return (
    <li key={props.feedback.id}>
      <a>
        {props.feedback.content}
      </a>
    </li>
  )
}

const LoginPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="btn"
        onClick={() => void signIn()}
      >
        Sign In
      </button>
    </div>
  );
};
