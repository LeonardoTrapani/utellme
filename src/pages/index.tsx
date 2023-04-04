import type { NextPage } from "next";
import Head from "next/head";

import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useState } from "react";
import { BiEdit, BiLink, BiMenu, BiTrash, BiQr } from "react-icons/bi"
import { BsIncognito } from "react-icons/bs"
import type { Feedback, Project } from "@prisma/client";
import { StaticRatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import useWindowSize from "~/utils/hooks";
import LoginPage from "./signin";

const Home: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'authenticated';

  const {
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
    data: projects
  } =
    api.projects.getAll.useQuery(undefined, {
      enabled: isSignedIn
    });

  const { mutate: deleteProject } = api.projects.delete.useMutation({
    onSuccess: () => {
      void refetchProjects();
      setSelectedProjectIndex(0);
    }
  });

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const [deleteModalInputValue, setDeleteModalInputValue] = useState('');
  const [modalHasError, setModalHasError] = useState(false);
  const resetModalState = () => {
    setModalHasError(false);
    setDeleteModalInputValue('');
  }

  const projectDeleteHandler = () => {
    if (!projects) return;
    const currentProjectId = projects[selectedProjectIndex]?.id;
    if (!currentProjectId) return;
    void deleteProject({
      projectId: currentProjectId
    });
    const element = document.getElementById('delete-project-modal') as HTMLInputElement;
    element.checked = false;
  }

  return (
    <>
      <Head>
        <title>Tell Me!</title>
        <meta name="description" content="a web app to get feedback" />
      </Head>
      <main>
        {(sessionStatus === 'loading') || (isProjectsLoading && sessionData?.user)
          ?
          <div className="flex items-center justify-center h-screen">
            <LoadingIndicator />
          </div> :
          isSignedIn ? (
            <>
              <DeleteProjectModal
                onDelete={projectDeleteHandler}
                projectTitle={projects?.[selectedProjectIndex]?.name}
                modalHasError={modalHasError}
                setModalHasError={setModalHasError}
                resetModalState={resetModalState}
                inputValue={deleteModalInputValue}
                setInputValue={setDeleteModalInputValue}
              />
              <MainPageContent
                setSelectedProjectIndex={(i: number) => {
                  setSelectedProjectIndex(i);
                  resetModalState();
                }}
                selectedProjectIndex={selectedProjectIndex}
              />
            </>
          )
            :
            <LoginPage />
        }
      </main >
    </>
  );
};

export default Home;

const DeleteProjectModal: React.FC<{
  onDelete: () => void;
  projectTitle: string | undefined;
  modalHasError: boolean;
  setModalHasError: (value: boolean) => void;
  resetModalState: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
}> = (props) => {
  const deleteHandler = (updatedValue?: string) => {
    if (!props.projectTitle) return;
    const value = updatedValue || props.inputValue;
    if (value === props.projectTitle) {
      props.resetModalState()
      props.onDelete();
    } else {
      props.setModalHasError(true);
    }
  }


  return (
    <>
      <input type="checkbox" id="delete-project-modal" className="modal-toggle" />
      <label htmlFor="delete-project-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Are you sure you want to delete this project?</h3>
          <p className="py-4">This action cannot be undone. You will lose all <span>{props.projectTitle || "your project"}</span>&apos;s feedback forever</p>
          <div className="divider mt-0 mb-0" />
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className={`label-text ${props.modalHasError ? 'text-error' : 'text-warning'}`}>Insert project name to confirm</span>
            </label>
            <input
              type="text"
              placeholder="Project Name"
              className={`input input-bordered w-full input-warning ${props.modalHasError ? 'input-error' : ''}`}
              onChange={(e) => {
                props.setInputValue(e.currentTarget.value);
              }}
              value={props.inputValue}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  deleteHandler(e.currentTarget.value);
                  e.currentTarget.value = "";
                }
              }}
            />
          </div>
          <div className="modal-action">
            <ModalActionButton
              modalId="delete-project-modal"
              onClick={props.resetModalState}
            >
              No
            </ModalActionButton>
            <ModalActionButton
              modalId="delete-project-modal"
              isRed
              onClick={() => deleteHandler()}
              disableClose
            >
              Confirm
            </ModalActionButton>
          </div>
        </label>
      </label>
    </>
  )
}

const ModalActionButton: React.FC<{
  modalId: string;
  children: React.ReactNode;
  isRed?: boolean;
  onClick?: () => void;
  disableClose?: boolean;
}> = (props) => {
  return (
    <a onClick={props.onClick}>
      <label htmlFor={!props.disableClose ? props.modalId : 'you are not closing'} className={`btn ${props.isRed ? 'btn-error' : ''}`}>
        {props.children}
      </label>
    </a>
  )
}

const MainPageContent: React.FC<{
  selectedProjectIndex: number;
  setSelectedProjectIndex: (i: number) => void;
}> = (props) => {
  const { data: projectsData } = api.projects.getAll.useQuery();

  const onProjectPress = (i: number) => {
    props.setSelectedProjectIndex(i);
  }

  const [windowWidth] = useWindowSize()

  if (!projectsData) {
    return <></>
  }

  return (
    <ProjectDrawerContainer
      projectsData={projectsData}
      selectedProjectIndex={props.selectedProjectIndex}
      onProjectPress={onProjectPress}
    >
      {
        (windowWidth || 0) < 768 //if we are in mobile we need the icons above the main page content 
        &&
        <ActionIconsComponent
          projectId={projectsData[props.selectedProjectIndex]?.id}
          areThereProjects={projectsData.length > 0}
        />
      }
      <ProjectMainContent selectedProjectIndex={props.selectedProjectIndex} />
    </ProjectDrawerContainer>
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
  if (!projectsData.length) {
    return <NoProjectsComponent />
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
            <ActionIconsComponent
              projectId={projectsData[props.selectedProjectIndex]?.id}
              areThereProjects={projectsData.length > 0}
            />
            :
            <></>
        }
      </div>
      {
        (!!projectsData && projectsData[props.selectedProjectIndex]?.feedbacks.length)
          ?
          <FeedbackList feedbacks={projectsData[props.selectedProjectIndex]?.feedbacks} projectId={projectsData[props.selectedProjectIndex]?.id} />
          :
          <NoFeedbackComponent projectId={projectsData[props.selectedProjectIndex]?.id || "-1"} />
      }
    </>
  )
}

const NoFeedbackComponent: React.FC<{
  projectId: string;
}> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div>
        <h1 className="font-bold text-2xl lg:text-3xl text-center">No feedback yet</h1>
        <p className="text-center text-lg">Share your project&apos;s link to start collecting feedback</p>
        <div className="divider" />
        <ProjectInstructions projectId={props.projectId} />
      </div>
    </div>
  )
}

const ProjectInstructions: React.FC<{
  projectId: string;
}> = (props) => {
  return (
    <div className="flex justify-center mt-4 items-center">
      <ProjectInstructionsRow
        onPress={onGenerateQr}
        instructionName="Create QR-Code"
      >
        <SingleActionIcon>
          <BiQr size={26} />
        </SingleActionIcon>
      </ProjectInstructionsRow>
      <div className="divider divider-horizontal">OR</div>
      <ProjectInstructionsRow
        onPress={() => { void onCopyLink(props.projectId) }}
        instructionName="Share link"
      >
        <SingleActionIcon>
          <BiLink size={26} />
        </SingleActionIcon>
      </ProjectInstructionsRow>
    </div>
  )
}

const ProjectInstructionsRow: React.FC<{
  instructionName: string;
  onPress?: () => void;
  children: React.ReactNode;
}> = (props) => {
  return (
    <button 
      className="gap-1 btn"
      onClick={props.onPress}
    >
      {props.children}
      <p>{props.instructionName}</p>
    </button>
  )
}

const onGenerateQr = () => {
  console.log('generate qr')
}

const onCopyLink = async (projectId: string) => {
  console.log("copying")
  const projectLink = `https://tell-me-leonardotrapani.vercel.app/newfeedback/${projectId || "ERROR"}`
  await navigator.clipboard.writeText(projectLink)
}

const NoProjectsComponent: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div>
        <h1 className="font-bold text-2xl lg:text-3xl text-center">You don&apos;t have any projects yet</h1>
        <p className="text-center">Create a new project to start collecting feedback</p>
      </div>
      <a
        onClick={() => {
          setTimeout(() => {
            const newProjectInput = document.getElementById('new-project-input') as HTMLInputElement;
            newProjectInput.focus();
          }, 100)
        }}
      >
        <label
          htmlFor="drawer"
          className="cursor-pointer btn"
        >
          New Project
        </label>
      </a>
    </div>
  )
}

const ActionIconsComponent: React.FC<{
  projectId: string | undefined;
  areThereProjects: boolean;
}> = (props) => {
  const [windowWidth] = useWindowSize()
  const isSmall = (windowWidth || 0) < 768;
  const isMedium = ((windowWidth || 0) < 1024) && ((windowWidth || 0) >= 768);
  const isBig = (windowWidth || 0) >= 1024;
  const [isCopySuccesfull, setIsCopySuccesfull] = useState(false);



  const onEditProject = () => {
    console.log('edit project')
  }

  return (
    <div className={
      isSmall ? 'flex flex-row justify-end items-center gap-1' :
        isMedium || isBig ? 'flex flex-row items-start justify-end ml-4 gap-1' :
          ''
    }>
      {
        props.areThereProjects &&
        (
          <>
            <SingleActionIcon
              onPress={onGenerateQr}
              tooltipName="Generate QR"
            >
              <BiQr size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              onPress={() => {
                void onCopyLink(props.projectId || "-1")
                setIsCopySuccesfull(true)
                setTimeout(() => {
                  setIsCopySuccesfull(false);
                }, 1500)
              }}
              tooltipName={isCopySuccesfull ? "copied" : "Copy Link"}
            >
              <BiLink size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              onPress={onEditProject}
              tooltipName="Edit Project"
            >
              <BiEdit size={26} />
            </SingleActionIcon>
            <DeleteProjectActionIcon
              tooltipName="Delete Project"
            >
              <label htmlFor="delete-project-modal" className="cursor-pointer">
                <BiTrash size={26} />
              </label>
            </DeleteProjectActionIcon>
          </>
        )
      }
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
  onPress?: () => void;
  tooltipName?: string;
  isTooltipSuccess?: boolean;
}> = (props) => {
  return (
    <div
      className={`${!!props.tooltipName ? ' tooltip tooltip-left' : ''}`}
      data-tip={props.tooltipName?.toLowerCase()}
    >
      <a className="cursor-pointer" onClick={props.onPress}>
        {props.children}
      </a>
    </div>
  )
}


const DeleteProjectActionIcon: React.FC<{
  children: React.ReactNode;
  tooltipName?: string;
  isTooltipSuccess?: boolean;
}> = (props) => {
  return (
    <div
      className={`${!!props.tooltipName ? ' tooltip tooltip-left' : ''}`}
      data-tip={props.tooltipName?.toLowerCase()}
    >
      {props.children}
    </div>
  )
}

const FeedbackList: React.FC<{ feedbacks: Feedback[] | undefined; projectId: string | undefined; }> = (props) => {
  const {
    data: feedbacksData,
    isLoading: isFeedbackDataLoading
  } = api.feedbacks.getAll.useQuery({
    projectId: props.projectId || "-1"
  });

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
  const { refetch: refetchProjects } = api.projects.getAll.useQuery();

  //const [showLoading, setShowLoading] = useState(false); //this is used to show the loading animation between fetch and mutatin
  const [newProjectInputHasError, setNewProjectInputHasError] = useState(false);

  const projectSubmitHandler = (projectTitle: string) => {
    if (!projectTitle.length) {
      setNewProjectInputHasError(true);
      return;
    }
    // setShowLoading(true)
    createMutation.mutate({ name: projectTitle }, {
      onSuccess: () => {
        void refetchProjects()
        //setShowLoading(false);
        props.onProjectPress(0)
      },
      onError: () => {
        //setShowLoading(false)
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
            id="new-project-input"
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
          <StaticRatingComponent rating={props.feedback.rating} />
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
