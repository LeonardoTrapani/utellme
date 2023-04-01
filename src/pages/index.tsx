import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { BiLink, BiMenu } from "react-icons/bi"
import type { Feedback, Project } from "@prisma/client";
import { RatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import useWindowSize from "~/utils/hooks";

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

  const [windowWidth] = useWindowSize()
  return (
    <body>
      <ProjectDrawerContainer
        projectsData={projectsData}
        selectedProjectIndex={selectedProjectIndex}
        onProjectPress={onProjectPress}
      >
        {
          (windowWidth || 0) < 768
          &&
          <MenuIconsComponent row />
        }
        {projectsData &&
          <>
            <div className="mb-3 flex">
              <div className="grow">
                <h1 className="text-3xl font-bold">{projectsData[selectedProjectIndex]?.name}</h1>
                <h3 className="italic">{projectsData[selectedProjectIndex]?.description}</h3>
              </div>
              {
                ((windowWidth || 0) >= 768 && (windowWidth || 0) < 1024)
                  ?
                  <MenuIconsComponent />
                  :
                  <></>
              }
            </div>
            {
              projectsData && projectsData[selectedProjectIndex]?.feedbacks.length
                ?
                <FeedbackList feedbacks={projectsData[selectedProjectIndex]?.feedbacks} />
                :
                <p>No Feedbacks yet. Share the project</p>
            }
          </>
        }
      </ProjectDrawerContainer>
    </body>
  )
}

const MenuIconsComponent: React.FC<{ row?: boolean }> = (props) => {
  return (
    <div className={`flex ${props.row ? 'flex self-end' : 'flex-col ml-4'}`}>
      <label htmlFor="drawer" className="drawer-button cursor-pointer">
        <BiMenu size={36} />
      </label>
      <a className="cursor-pointer">
        <BiLink size={36} />
      </a>
    </div>
  )
}
const FeedbackList: React.FC<{ feedbacks: Feedback[] | undefined }> = (props) => {
  const { data: feedbacksData, isLoading: isFeedbackDataLoading } = api.feedbacks.getAll.useQuery();
  return (
    <ul className="gap-2 grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4">
      {
        isFeedbackDataLoading ? props.feedbacks?.map((feedback) => {
          return <FeedbackComponent key={feedback.id} feedback={feedback} />
        }) : feedbacksData?.map((feedback) => {
          return <FeedbackComponent key={feedback.id} feedback={feedback} />
        })
      }
    </ul>
  )
}

type ProjectsDataType = (Project & {
  feedbacks: Feedback[];
})[] | undefined

const ProjectDrawerContainer: React.FC<{
  projectsData: ProjectsDataType;
  selectedProjectIndex: number; onProjectPress: (i: number) => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <div className="drawer drawer-mobile p-2">
      <input id="drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col lg:ml-2 ">
        {props.children}
      </div>
      <div className="drawer-side">
        <label htmlFor="drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 bg-base-200 text-base-content rounded-xl">
          <TitleAndAvatarComponen />
          <div className="divider mt-2" />
          <li><button className={`btn ${props.projectsData?.length ? 'mb-2' : ''}`}>New Project</button></li>
          {
            props.projectsData?.map((project, i) => {
              return <ProjectComponent
                key={i}
                project={project}
                isActive={props.selectedProjectIndex === i}
                onPress={props.onProjectPress}
                index={i} />
            })
          }
        </ul>
      </div>
    </div>
  )
}

const TitleAndAvatarComponen = () => {
  return (
    <div className="flex justify-between items-center">
      <p className="font-bold text-xl select-none">TELL <span className="text-primary">ME!</span></p>
      <Avatar>
        <li>
          <a onClick={() => void signOut()} className="flex justify-between">
            <p>
              Sign Out
            </p>
            <BiLogOut size={20} />
          </a>
        </li>
      </Avatar>
    </div>
  )
}

const ProjectComponent: React.FC<{
  project: Project,
  isActive: boolean, onPress: (i: number) => void; index: number
}> = (props) => {
  return (
    <li key={props.project.id}>
      <a
        className={`${props.isActive ? "active font-semibold" : ""}`}
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
      <div className="bg-base-200 rounded-xl p-2 h-full flex flex-col justify-between">
        <div>
          <RatingComponent rating={props.feedback.rating} />
          {
            props.feedback.title ?
              <h2 className="text-xl font-bold">
                {props.feedback.title}
              </h2>
              :
              <></>
          }
          <p>
            {props.feedback.content}
          </p>
        </div>
        <p className="text-gray-500 text-right italic align-text-bottom">
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
