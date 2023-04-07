import type { NextPage } from "next";
import Head from "next/head";

import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import { BiEdit, BiMenu, BiTrash, BiQr, BiShareAlt } from "react-icons/bi"
import { BsIncognito } from "react-icons/bs"
import type { Feedback, Project } from "@prisma/client";
import { StaticRatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import { useWindowSize } from "~/utils/hooks";
import LoginPage from "./signin";
import { toast } from "react-hot-toast";
import QRCode from 'qrcode'
import Input from "~/components/Input";
import { TellMeComponent } from "~/components/TellMeComponent";
import LandingPage from "~/components/LandingPage";

const Home: NextPage = () => {
  const { data: sessionData, status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'authenticated';

  const {
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
    data: projects,
    isError: isGetAllProjectsError
  } =
    api.projects.getAll.useQuery(undefined, {
      enabled: isSignedIn
    });

  const { mutate: deleteProject, isError: isDeleteProjectError } = api.projects.delete.useMutation({
    onSuccess: () => {
      void refetchProjects();
      setSelectedProjectIndex(0);
    }
  });

  const { mutate: editProject, isError: isEditProjectError } = api.projects.edit.useMutation({
    onSuccess: () => {
      void refetchProjects();
    }
  })

  const [selectedProjectIndex, setSelectedProjectIndex] = useState(0);

  const [deleteModalInputValue, setDeleteModalInputValue] = useState('');
  const [deleteModalHasError, setDeleteModalHasError] = useState(false);

  const [editProjectNameValue, setEditProjectNameValue] = useState('');
  const [editProjectDescriptionValue, setEditProjectDescriptionValue] = useState('');
  const [editProjectNameHasError, setEditProjectNameHasError] = useState(false);

  useEffect(() => {
    setEditProjectNameValue(projects?.[selectedProjectIndex]?.name || '');
    setEditProjectDescriptionValue(projects?.[selectedProjectIndex]?.description || '');
  }, [projects, selectedProjectIndex])

  const resetEditModalState = () => {
    setEditProjectNameHasError(false);
  }
  const resetDeleteModalState = () => {
    setDeleteModalHasError(false);
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

  const projectEditHandler = () => {
    if (!projects) return;
    const currentProjectId = projects[selectedProjectIndex]?.id;
    if (!currentProjectId) return;
    void editProject({
      projectId: currentProjectId,
      newName: editProjectNameValue,
      newDescription: editProjectDescriptionValue,
    });
    const element = document.getElementById('edit-project-modal') as HTMLInputElement;
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
              <MainPageContent
                setSelectedProjectIndex={(i: number) => {
                  setSelectedProjectIndex(i);
                  resetDeleteModalState();
                  resetEditModalState();
                }}
                selectedProjectIndex={selectedProjectIndex}
              />
              <DeleteProjectModal
                onDelete={projectDeleteHandler}
                projectTitle={projects?.[selectedProjectIndex]?.name}
                modalHasError={deleteModalHasError}
                setModalHasError={setDeleteModalHasError}
                resetModalState={resetDeleteModalState}
                inputValue={deleteModalInputValue}
                setInputValue={setDeleteModalInputValue}
              />
              <EditProjectModal
                projectName={projects?.[selectedProjectIndex]?.name || 'Project name'}
                projectDescription={projects?.[selectedProjectIndex]?.description || 'Project description'}
                resetModalState={resetEditModalState}
                setDescriptionInputValue={setEditProjectDescriptionValue}
                setNameInputValue={setEditProjectNameValue}
                nameInputValue={editProjectNameValue}
                descriptionInputValue={editProjectDescriptionValue}
                onEdit={projectEditHandler}
                editProjectNameHasError={editProjectNameHasError}
                setNameInputHasError={(value) => { setEditProjectNameHasError(value) }}
              />
            </>
          )
            :
            <LandingPage />
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

const EditProjectModal: React.FC<{
  resetModalState: () => void;
  projectDescription: string;
  projectName: string;
  setDescriptionInputValue: (value: string) => void;
  setNameInputValue: (value: string) => void;
  descriptionInputValue: string;
  nameInputValue: string;
  onEdit: () => void;
  editProjectNameHasError: boolean;
  setNameInputHasError: (hasError: boolean) => void;
}> = (props) => {
  const editHandler = () => {
    if (props.nameInputValue.length < 1) {
      props.setNameInputHasError(true)
      return;
    }
    props.onEdit();
  }

  return (
    <>
      <input type="checkbox" id="edit-project-modal" className="modal-toggle" />
      <label htmlFor="edit-project-modal" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <div className="form-control gap-4">
            <Input
              name="Name"
              placeholder={props.projectName}
              onChange={(value) => {
                props.setNameInputHasError(false)
                props.setNameInputValue(value);
              }}
              value={props.nameInputValue}
              isError={props.editProjectNameHasError}
              maxLength={75}
            />
            <textarea
              placeholder={props.projectDescription}
              className={`mt-2 textarea textarea-bordered textarea-md w-full placeholder:text-gray-500`}
              onChange={(e) => props.setDescriptionInputValue(e.target.value)}
              rows={6}
              value={props.descriptionInputValue}
            />
          </div>
          <div className="modal-action">
            <ModalActionButton
              modalId="edit-project-modal"
              onClick={props.resetModalState}
            >
              No
            </ModalActionButton>
            <ModalActionButton
              modalId="edit-project-modal"
              isPrimary
              onClick={() => editHandler()}
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
  isPrimary?: boolean;
}> = (props) => {
  return (
    <a onClick={props.onClick}>
      <label htmlFor={!props.disableClose ? props.modalId : 'you are not closing'}
        className={`btn ${props.isPrimary ? 'btn-primary' : ''} ${props.isRed ? 'btn-error' : ''}`}>
        {props.children}
      </label>
    </a>
  )
}

const MainPageContent: React.FC<{
  selectedProjectIndex: number;
  setSelectedProjectIndex: (i: number) => void;
}> = (props) => {
  const { data: projectsData, isError: isGetAllProjectsError } = api.projects.getAll.useQuery();

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
          projectName={projectsData[props.selectedProjectIndex]?.name}
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
  const { data: projectsData, refetch: refetchProjects, isError: isProjectsError } = api.projects.getAll.useQuery();
  const { mutate: editDescription, isError: isEditProjectError } = api.projects.edit.useMutation({
    onSuccess: () => {
      void refetchProjects()
    }
  })

  const [windowWidth] = useWindowSize()
  if (!projectsData) {
    return <></>
  }
  const editDescriptionHandler = (newDescription: string) => {
    editDescription({
      newDescription,
      projectId: projectsData[props.selectedProjectIndex]?.id || "-1"
    });
  }

  if (!projectsData.length) {
    return (
      <>
        {

          (windowWidth || 0) >= 768
            ?
            <ActionIconsComponent
              projectId={projectsData[props.selectedProjectIndex]?.id}
              areThereProjects={projectsData.length > 0}
              projectName={projectsData[props.selectedProjectIndex]?.name}
            />
            :
            <></>
        }
        <NoProjectsComponent />
      </>
    )
  }

  return (
    <>
      <div className="mb-3 flex">
        <div className="grow">
          <h1 className="text-3xl font-bold">{projectsData[props.selectedProjectIndex]?.name}</h1>
          {
            <DescriptionOrAddDescriptionComponent
              projectDescription={projectsData[props.selectedProjectIndex]?.description}
              editDescription={editDescriptionHandler}
            />
          }
        </div>
        {
          (windowWidth || 0) >= 768
            ?
            <ActionIconsComponent
              projectId={projectsData[props.selectedProjectIndex]?.id}
              areThereProjects={projectsData.length > 0}
              projectName={projectsData[props.selectedProjectIndex]?.name}
            />
            :
            <></>
        }
      </div>
      {
        (
          (!!projectsData && projectsData[props.selectedProjectIndex]?.feedbacks.length)
            ?
            <FeedbackList feedbacks={projectsData[props.selectedProjectIndex]?.feedbacks} projectId={projectsData[props.selectedProjectIndex]?.id} />
            :
            <NoFeedbackComponent
              projectId={projectsData[props.selectedProjectIndex]?.id || "-1"}
              projectName={projectsData[props.selectedProjectIndex]?.name}
            />
        )
      }
    </>
  )
}

const DescriptionOrAddDescriptionComponent: React.FC<{
  projectDescription: string | null | undefined;
  editDescription: (value: string) => void;
}> = (props) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState(props.projectDescription || "");
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "0px"
      // We need to reset the height momentarily to get the correct scrollHeight for the textarea
      textAreaRef.current.style.height = "0px";
      const scrollHeight = textAreaRef.current.scrollHeight;

      // We then set the height directly, outside of the render loop
      // Trying to set this with state or a ref will product an incorrect value.
      if (scrollHeight < 112) {
        textAreaRef.current.style.height = `${scrollHeight}` + "px";
      } else {
        textAreaRef.current.style.height = "112px";
      }
    }
  }, [textAreaRef, value])

  if (props.projectDescription) {
    return (
      <h3 className="italic overflow-x-hidden overflow-y-auto max-h-28">{props.projectDescription}</h3>
    )
  }

  return (
    <textarea
      placeholder="Add a description"
      className={
        `
        input input-ghost w-full p-0 m-0 outline-none 
        b-0 outline-0 focus:outline-0 h-6 placeholder-gray-500 
        italic none resize-none
        `
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault()
          setValue('')
          props.editDescription(e.currentTarget.value)
          return;
        }
      }}
      onChange={(e) => {
        setValue(e.currentTarget.value)
      }}
      rows={1}
      ref={textAreaRef}
    />
  )
}
const NoFeedbackComponent: React.FC<{
  projectId: string;
  projectName: string | undefined;
}> = (props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div>
        <h1 className="font-bold text-2xl lg:text-3xl text-center">No feedback yet</h1>
        <p className="text-center text-lg">Share your project to start collecting feedback</p>
        <div className="divider" />
        <ProjectInstructions projectId={props.projectId} projectName={props.projectName} />
      </div>
    </div>
  )
}

const ProjectInstructions: React.FC<{
  projectId: string;
  projectName: string | undefined
}> = (props) => {
  return (
    <div className="flex justify-center mt-4 items-center flex-col md:flex-row gap-2">
      <ProjectInstructionsRow
        onPress={() => { void onGenerateQr(props.projectId, props.projectName || "this project") }}
        instructionName="Generate QR-Code"
      >
        <SingleActionIcon>
          <BiQr size={26} />
        </SingleActionIcon>
      </ProjectInstructionsRow>
      <ProjectInstructionsRow
        onPress={() => {
          void shareOrCopyToClipboard(
            {
              description: `Scan this QR-Code to give feedback to ${props.projectName || "thisProject"}!`,
              isFile: false,
              text: getProjectUrl(props.projectId || "-1"),
              title: `What do you think about ${props.projectName || "this project"}?`
            }
          )

        }}
        instructionName="Share Link"
      >
        <SingleActionIcon>
          <BiShareAlt size={26} />
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

const onGenerateQr = async (projectId: string, projectName: string) => {
  const projectLink = getProjectUrl(projectId);
  try {
    const qrImage = await QRCode.toDataURL(
      projectLink,
      { type: 'image/png' },
    )
    await shareOrCopyToClipboard({
      title: `${projectName || "My project"}'s QR-Code`,
      isFile: true,
      fileName: `${projectName || "My project"}'s QR-Code.png`,
      description: `Scan this QR-Code to give feedback about ${projectName || "my project"}!`,
      text: qrImage
    })
  } catch (err) {
    toast('Something went wrong generating the QR-Code', {
      className: 'bg-error text-error'
    })
  }
}


const shareOrCopyToClipboard = async ({
  text,
  title,
  isFile,
  fileName,
  description
}: {
  text: string,
  title?: string,
  isFile?: boolean
  description: string
  fileName?: string;
}) => {
  if (isFile) {
    const blob = await (await fetch(text)).blob()
    const file = new File([blob], (fileName || 'projectQr.png'), { type: blob.type })
    downloadFile(fileName || 'projectQr.png', file)
    return;
  }
  const shareData: ShareData = {
    title,
    url: text,
    text: description
  };
  if (navigator.share && navigator.canShare(shareData)) {
    void navigator.share({
      title,
      url: text,
      text: description
    })
  } else {
    void copyToClipboard(text);
  }
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  toast('Copied to the clipboard!')
}

/*
const copyFileToClipboard = async (blob: Blob) => {
  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ])
  toast('Copied to the clipboard')
}
*/

const downloadFile = (fileName: string, blob: Blob) => {
  const url = window.URL.createObjectURL(
    new Blob([blob]),
  );
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute(
    'download',
    `${fileName}`,
  );

  // Append to html link element page
  document.body.appendChild(link);

  // Start download
  link.click();
  toast("Downloaded!")

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

/*
const onShareLink = (projectId: string, projectName: string | undefined) => {
  const projectLink = getProjectLink(projectId);
  if (navigator.share) {
    void navigator.share({
      title: `What do you think about ${projectName || "this project"}?`,
      url: projectLink,
    })
  } else {
    onCopyLink(projectId)
  }
}
*/

const getProjectUrl = (projectId: string) => {
  return `${window.location.origin}/newfeedback/${projectId}`
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
  projectName: string | undefined;
}> = (props) => {
  const [windowWidth] = useWindowSize()
  const isSmall = (windowWidth || 0) < 768;
  const isMedium = ((windowWidth || 0) < 1024) && ((windowWidth || 0) >= 768);
  const isBig = (windowWidth || 0) >= 1024;

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
              onPress={() => {
                void onGenerateQr(props.projectId || "-1", props.projectName || "this project");
              }}
              tooltipName="Generate QR"
            >
              <BiQr size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              onPress={() => {
                void shareOrCopyToClipboard(
                  {
                    description: `open this link to give feedback to ${props.projectName || "this project"}`,
                    isFile: false,
                    text: getProjectUrl(props.projectId || "-1"),
                    title: `What do you think about ${props.projectName || "this project"}?`
                  }
                )
              }}
              tooltipName="share project"
            >
              <BiShareAlt size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="Edit Project"
            >
              <label htmlFor="edit-project-modal" className="cursor-pointer">
                <BiEdit size={26} />
              </label>
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
    </div >
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
    isLoading: isFeedbackDataLoading,
    isError: isGetAllFeedbacksError,
  } = api.feedbacks.getAll.useQuery({
    projectId: props.projectId || "-1"
  });

  return (
    <div className="overflow-y-auto">
      <ul className="gap-2 grid md:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4">
        {
          isFeedbackDataLoading ? props.feedbacks?.map((feedback) => {
            return <FeedbackComponent key={feedback.id} feedback={feedback} />
          }) : feedbacksData?.map((feedback) => {
            return <FeedbackComponent key={feedback.id} feedback={feedback} />
          })
        }
      </ul>
    </div>
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
  const { mutate: createProject, isError: isCreateProjectError } = api.projects.create.useMutation()
  const { refetch: refetchProjects, isError: isGetAllProjectsError } = api.projects.getAll.useQuery();

  //const [showLoading, setShowLoading] = useState(false); //this is used to show the loading animation between fetch and mutatin
  const [newProjectInputHasError, setNewProjectInputHasError] = useState(false);

  const projectSubmitHandler = (projectTitle: string) => {
    if (!projectTitle.length) {
      setNewProjectInputHasError(true);
      return;
    }
    // setShowLoading(true)
    createProject({ name: projectTitle }, {
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

  const [currentLength, setCurrentLength] = useState(0);
  const maxTitleLength = 75;

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
            className={`input input-bordered w-full max-w-xs ${currentLength >= maxTitleLength ? "input-warning" : ""} ${newProjectInputHasError ? 'input-error' : ''}`}
            maxLength={maxTitleLength}
            onChange={(e) => {
              setCurrentLength(e.currentTarget.value.length)
            }}
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
      <TellMeComponent />
      <Avatar>
        <li>
          <a onClick={() => {
            void signOut();
          }} className="flex justify-between">
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
          <p className="max-h-40 overflow-y-auto">
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
