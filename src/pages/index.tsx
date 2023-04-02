import type { NextPage } from "next";
import Head from "next/head";

import { signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { BiEdit, BiLink, BiMenu, BiTrash, BiQr } from "react-icons/bi"
import { BsIncognito } from "react-icons/bs"
import type { Feedback, Project } from "@prisma/client";
import { RatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import useWindowSize from "~/utils/hooks";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Home: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'authenticated';
  const { isLoading: isProjectsLoading } = api.projects.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Tell Me</title>
        <meta name="description" content="a web app to get feedback" />
        <link rel='icon' href="/favicon.ico" />
      </Head>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme={"dark"}
        pauseOnHover
        bodyStyle={{ borderRadius: 12 }}
        progressStyle={{ background: "#eab308" }}
      />
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

  if (!projectsData) {
    return <></>
  }

  return (
    <body>
      <ProjectDrawerContainer
        projectsData={projectsData}
        selectedProjectIndex={selectedProjectIndex}
        onProjectPress={onProjectPress}
      >
        {
          (windowWidth || 0) < 768 //if we are in mobile we need the icons above the main page content 
          &&
          <ActionIconsComponent projectId={projectsData[selectedProjectIndex]?.id} />
        }
        <ProjectMainContent selectedProjectIndex={selectedProjectIndex} />
      </ProjectDrawerContainer>
    </body>
  )
}

const ProjectMainContent: React.FC<{
  selectedProjectIndex: number;
}> = (props) => {
  const { data: projectsData } = api.projects.getAll.useQuery();
  const [windowWidth] = useWindowSize()
  if (!projectsData) {
    return <></>
  }
  return (
    <>
      <div className="mb-3 flex">
        <div className="grow">
          <h1 className="text-3xl font-bold">{projectsData[props.selectedProjectIndex]?.name}</h1>
          <h3 className="italic">{projectsData[props.selectedProjectIndex]?.description}</h3>
        </div>
        {
          (windowWidth || 0) >= 768
            ?
            <ActionIconsComponent projectId={projectsData[props.selectedProjectIndex]?.id} />
            :
            <></>
        }
      </div>
      {
        projectsData[props.selectedProjectIndex]?.feedbacks.length
          ?
          <FeedbackList feedbacks={projectsData[props.selectedProjectIndex]?.feedbacks} />
          :
          <p>No Feedbacks yet. Share the project to get some!</p>
      }
    </>
  )
}
const ActionIconsComponent: React.FC<{ projectId: string | undefined }> = (props) => {
  const [windowWidth] = useWindowSize()
  const isSmall = (windowWidth || 0) < 768;
  const isMedium = ((windowWidth || 0) < 1024) && ((windowWidth || 0) >= 768);
  const isBig = (windowWidth || 0) >= 1024;

  const onGenerateQr = () => {
    console.log('generate qr')
  }

  const onCopyLink = () => {
    const projectLink = `https://tell-me-leonardotrapani.vercel.app/project/${props.projectId || "ERROR"}`
    toast('✅ Copied link succesfully. Share it to get feedback!', { progressStyle: { background: 'rgb(34 197 94)' } })
    void navigator.clipboard.writeText(projectLink)
  }

  const onEditProject = () => {
    console.log('edit project')
  }

  const onDeleteProject = () => {
    console.log('delete project')
  }

  return (
    <div className={
      isSmall ? 'flex flex-row justify-end items-center gap-1' :
        isMedium || isBig ? 'flex flex-row items-start justify-end ml-4 gap-1' :
          ''
    }>
      <SingleActionIcon onPress={onGenerateQr}>
        <BiQr size={26} />
      </SingleActionIcon>
      <SingleActionIcon onPress={onCopyLink}>
        <BiLink size={26} />
      </SingleActionIcon>
      <SingleActionIcon onPress={onEditProject}>
        <BiEdit size={26} />
      </SingleActionIcon>
      <SingleActionIcon onPress={onDeleteProject}>
        <BiTrash size={26} />
      </SingleActionIcon>
      {
        !isBig && <label htmlFor="drawer" className="cursor-pointer">
          <BiMenu size={26} className="text-primary" />
        </label>
      }
    </div>
  )
}

const SingleActionIcon: React.FC<{
  children: React.ReactNode;
  onPress: () => void;
}> = (props) => {
  return (
    <a className="cursor-pointer" onClick={props.onPress}>
      {props.children}
    </a>
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
  selectedProjectIndex: number;
  onProjectPress: (i: number) => void;
  children: React.ReactNode;
}> = (props) => {
  const createMutation = api.projects.create.useMutation()
  const { refetch: refetchProjects, isFetching: isProjectFetching } = api.projects.getAll.useQuery();

  const [showLoading, setShowLoading] = useState(false); //this is used to show the loading animation between fetch and mutatin
  const [newProjectInputHasError, setNewProjectInputHasError] = useState(false);

  const projectSubmitHandler = (projectTitle: string) => {
    if (!projectTitle.length) {
      setNewProjectInputHasError(true);
      return;
    }
    setShowLoading(true)
    createMutation.mutate({ name: projectTitle }, {
      onSuccess: () => {
        void refetchProjects()
        setShowLoading(false);
        props.onProjectPress(0)
      },
      onError: () => {
        setShowLoading(false)
      },
    });
  }

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
          <div className="divider mt-2 mb-2" />
          <input
            type="text"
            placeholder="New Project"
            className={`input input-bordered w-full max-w-xs ${newProjectInputHasError ? 'input-error' : ''}`}
            onKeyDown={(e) => {
              if (newProjectInputHasError) {
                setNewProjectInputHasError(false)
              }
              if (e.key === "Enter") {
                projectSubmitHandler(e.currentTarget.value);
                e.currentTarget.value = "";
              }
            }}
          />
          <div className="divider mt-2 mb-2" />
          {
            isProjectFetching || showLoading
              ?
              <div className="text-center mt-2">
                <LoadingIndicator />
              </div>
              :
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
        className={`${props.isActive ? "active bg-yellow-500" : ""}`}
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
        {
          props.feedback.author ?
            <p className="text-gray-500 text-right italic align-text-bottom">
              {props.feedback.author}
            </p>
            :
            <div className="flex flex-row justify-end items-center gap-1">
              <BsIncognito className="text-gray-500" />
              <p className="text-gray-500 text-right italic align-text-bottom">
                Anonymous
              </p>
            </div>
        }
      </div>
    </li >
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
