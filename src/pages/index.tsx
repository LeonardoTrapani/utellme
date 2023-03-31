import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import Navbar from "~/components/Navbar";
import { useState } from "react";
import type { Feedback, Project } from "@prisma/client";
import { RatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";

const Home: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const { isLoading: isProjectsLoading } = api.projects.getAll.useQuery();
  const isSignedIn = !!sessionData

  return (
    <>
      <Head>
        <title>Tell Me</title>
        <meta name="description" content="a web app to get feedback" />
        <link rel='icon' href="/favicon.ico" />
      </Head>
      <main>
        {(sessionStatus === 'loading') || (isProjectsLoading && sessionData?.user)
          ?
          <div className="flex items-center justify-center h-screen">
            <LoadingIndicator />
          </div> :
          (isSignedIn ? <MainPageContent /> : <LoginPage />)
        }
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
    <div className="h-screen">
      <Navbar />
      <body className="flex items-stretch p-2 my-2 h-">
        <ProjectMenuComponent projectsData={projectsData} selectedProjectIndex={selectedProjectIndex} onProjectPress={onProjectPress} />
        <ul className="gap-2 flex flex-col flex-1 mx-2">
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

type ProjectsDataType = (Project & {
  feedbacks: Feedback[];
})[] | undefined

const ProjectMenuComponent: React.FC<{
  projectsData: ProjectsDataType;
  selectedProjectIndex: number; onProjectPress: (i: number) => void
}> = (props) => {
  return (
    <ul className="menu bg-base-200 w-56 p-2 rounded-box mr-2">
      <li><button className={`btn mary ${props.projectsData?.length ? 'mb-2' : ''}`}>New Project</button></li>
      {
        props.projectsData?.map((project, i) => {
          return <ProjectComponent key={i} project={project} isActive={props.selectedProjectIndex === i} onPress={props.onProjectPress} index={i} />
        })
      }
    </ul>
  )
}

const ProjectComponent: React.FC<{
  project: Project,
  isActive: boolean, onPress: (i: number) => void; index: number
}> = (props) => {
  return (
    <li key={props.project.id}>
      <a
        className={`${props.isActive ? "active" : ""}`}
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
      <div className="bg-base-200 rounded-xl p-2">
        <RatingComponent rating={props.feedback.rating} />
        {
          props.feedback.title ?
            <h2 className="text-xl font-bold">
              {props.feedback.title}
            </h2>
            :
            <h2 className="text-xl font-bold text-gray-500">
              Untitled
            </h2>
        }
        <p>
          {props.feedback.content}
        </p>
        <p className="text-gray-500 text-right">
          {
            !props.feedback.anonymous ?
              props.feedback.author
              :
              "Anonymous"
          }
        </p>
      </div>
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
