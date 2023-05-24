import type { NextPage } from "next";
import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";
import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import { BiQr, BiShareAlt, BiCheck } from "react-icons/bi"
import { BsIncognito } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import type { Feedback, OrderBy, Project } from "@prisma/client";
import { StaticRatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import { useWindowSize } from "~/utils/hooks";
import { toast } from "react-hot-toast";
import Input from "~/components/Input";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { countLines, getProjectUrl, onGenerateQr, shareOrCopyToClipboard, timeSinceNow, toastTrpcError } from "~/utils/functions";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import DashboardModals from "~/components/DashboardModals";
import ActionIconsComponent, { SingleActionIcon } from "~/components/DashboardActionIcons";

const Home: NextPage = () => {
  const { status: sessionStatus } = useSession();
  const isSignedIn = sessionStatus === 'authenticated';

  const {
    refetch: refetchProjects,
    data: projects,
  } =
    api.projects.getAll.useQuery(undefined, {
      enabled: isSignedIn,
      onError: () => {
        toastTrpcError(
          "Something went wrong fetching the projects.",
          undefined,
          []
        )
      }
    });

  const { mutate: deleteProject, isLoading: isDeleteProjectLoading } = api.projects.delete.useMutation({
    onSuccess: () => {
      void refetchProjects();
      setSelectedProjectIndex(0);
    },
    onError: (e) => {
      toastTrpcError(
        "Something went wrong deleting the project.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "projectId", propertyMessage: "Project ID" },
        ]
      )
    }
  });

  const { mutate: editProject, isLoading: isEditProjectLoading } = api.projects.edit.useMutation({
    onSuccess: () => {
      void refetchProjects();
    },
    onError: (e) => {
      toastTrpcError(
        "Something went wrong editing the project.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "newName", propertyMessage: "New Name" },
          { propertyName: "newDescription", propertyMessage: "New Description" },
          { propertyName: "newMessage", propertyMessage: "New Message" },
          { propertyName: "projectId", propertyMessage: "Project ID" }
        ]
      )
    }
  })

  const { mutate: editColorProject, isLoading: isColorProjectLoading } = api.projects.edit.useMutation({
    onSuccess: () => {
      void refetchProjects();
    },
    onError: (e) => {
      toastTrpcError(
        "Something went wrong editing the project.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "projectId", propertyMessage: "Project ID" },
          { propertyName: "newTextColor", propertyMessage: "New Text Color" },
          { propertyName: "newPrimaryColor", propertyMessage: "New Primary Color" },
          { propertyName: "newBackgroundColor", propertyMessage: "New Background Color" },
        ]
      )
    }
  })

  const closeDrawer = () => {
    const drawer = document.getElementById('drawer') as HTMLInputElement || undefined;
    if (drawer) {
      drawer.checked = false;
    }
  }

  const setSelectedProjectIndex = (i: number) => {
    setSelectedProjectIndexState(i);
    setHasUpdatedProjectData(false);
    closeDrawer();
  }

  const [selectedProjectIndex, setSelectedProjectIndexState] = useState(0);

  const [deleteModalInputValue, setDeleteModalInputValue] = useState('');
  const [deleteModalHasError, setDeleteModalHasError] = useState(false);

  const [editProjectNameValue, setEditProjectNameValue] = useState('');
  const [editProjectDescriptionValue, setEditProjectDescriptionValue] = useState('');
  const [editProjectMessageValue, setEditProjectMessageValue] = useState('');
  const [editProjectNameHasError, setEditProjectNameHasError] = useState(false);

  const [projectTextColorValue, setProjectTextColorValue] = useState<string | null>(null)
  const [projectBackgroundColorValue, setProjectBackgroundColorValue] = useState<string | null>(null)
  const [projectPrimaryColorValue, setProjectPrimaryColorValue] = useState<string | null>(null)

  const [hasUpdatedProjectData, setHasUpdatedProjectData] = useState(false);

  useEffect(() => {
    if (hasUpdatedProjectData || !projects || !projects[selectedProjectIndex]) return;
    setProjectTextColorValue(projects?.[selectedProjectIndex]?.textColor || null);
    setProjectBackgroundColorValue(projects?.[selectedProjectIndex]?.backgroundColor || null);
    setProjectPrimaryColorValue(projects?.[selectedProjectIndex]?.primaryColor || null);
    setEditProjectNameValue(projects?.[selectedProjectIndex]?.name || '');
    setEditProjectDescriptionValue(projects?.[selectedProjectIndex]?.description || '');
    setEditProjectMessageValue(projects?.[selectedProjectIndex]?.message || '');

    setHasUpdatedProjectData(true);
  }, [hasUpdatedProjectData, projects, selectedProjectIndex])

  const resetEditModalState = () => {
    setEditProjectNameHasError(false);
    setEditProjectNameValue(projects?.[selectedProjectIndex]?.name || '');
    setEditProjectDescriptionValue(projects?.[selectedProjectIndex]?.description || '');
    setEditProjectMessageValue(projects?.[selectedProjectIndex]?.message || '');
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
      newMessage: editProjectMessageValue,
    });
    const element = document.getElementById('edit-project-modal') as HTMLInputElement;
    element.checked = false;
  }

  const handleEditColorProject = () => {
    const projectId = projects?.[selectedProjectIndex]?.id;
    if (!projectId) return;

    void editColorProject({
      projectId: projectId,
      newBackgroundColor: projectBackgroundColorValue,
      newTextColor: projectTextColorValue,
      newPrimaryColor: projectPrimaryColorValue,
    })
  }

  const { data: subscriptionStatus } = api.user.subscriptionStatus.useQuery();
  const isSubscribed = subscriptionStatus === "active";

  const { push } = useRouter();
  const { mutate: createCheckoutSession } = api.stripe.createCheckoutSession.useMutation({
    onError: (e) => {
      if (e.message) return toast.error(e.message);

      toastTrpcError(
        "Something went wrong creating your checkout session. Please try again later.",
        e.data?.zodError?.fieldErrors,
        []
      )
    },
    onSuccess: ({ checkoutUrl }) => {
      if (checkoutUrl) {
        void push(checkoutUrl);
      }
    }
  });

  return (
    <>
      <Head>
        <title>UTellMe</title>
        <meta name="description" content="get free quick and easy feedback with uTellMe" />
      </Head>
      <main>
        {(sessionStatus === 'loading')
          ?
          <></>
          :
          <>
            <MainPageContent
              setSelectedProjectIndex={(i: number) => {
                setSelectedProjectIndex(i);
                resetDeleteModalState();
                resetEditModalState();
              }}
              selectedProjectIndex={selectedProjectIndex}
              projectsData={projects}
              onRefetchProjects={() => void refetchProjects()}
              isDeleteProjectLoading={isDeleteProjectLoading}
              isEditProjectLoading={isEditProjectLoading}
              isColorProjectLoading={isColorProjectLoading}
            />
            <DashboardModals
              createCheckoutSession={createCheckoutSession}
              projectBackgroundColorValue={projectBackgroundColorValue}
              projectPrimaryColorValue={projectPrimaryColorValue}
              projectTextColorValue={projectTextColorValue}
              setProjectBackgroundColorValue={setProjectBackgroundColorValue}
              setProjectPrimaryColorValue={setProjectPrimaryColorValue}
              setProjectTextColorValue={setProjectTextColorValue}
              handleEditColorProject={handleEditColorProject}
              setEditProjectMessageValue={setEditProjectMessageValue}
              setEditProjectNameHasError={setEditProjectNameHasError}
              setEditProjectNameValue={setEditProjectNameValue}
              editProjectNameValue={editProjectNameValue}
              editProjectDescriptionValue={editProjectDescriptionValue}
              projectEditHandler={projectEditHandler}
              editProjectMessageValue={editProjectMessageValue}
              editProjectNameHasError={editProjectNameHasError}
              isSubscribed={isSubscribed}
              resetEditModalState={resetEditModalState}
              setEditProjectDescriptionValue={setEditProjectDescriptionValue}
              deleteModalInputValue={deleteModalInputValue}
              deleteModalHasError={deleteModalHasError}
              setDeleteModalHasError={setDeleteModalHasError}
              resetDeleteModalState={resetDeleteModalState}
              setDeleteModalInputValue={setDeleteModalInputValue}
              selectedProjectIndex={selectedProjectIndex}
              projects={projects}
              projectDeleteHandler={projectDeleteHandler}
            />
          </>
        }
      </main >
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/signin" } };
  }
  return {
    props: {}
  };
}

const MainPageContent: React.FC<{
  selectedProjectIndex: number;
  setSelectedProjectIndex: (i: number) => void;
  projectsData: Project[] | undefined;
  onRefetchProjects: () => void;
  isEditProjectLoading: boolean;
  isDeleteProjectLoading: boolean;
  isColorProjectLoading: boolean;
}> = (props) => {
  const onProjectPress = (i: number) => {
    props.setSelectedProjectIndex(i);
  }

  const [windowWidth] = useWindowSize()

  if (!props.projectsData) {
    return <></>
  }

  const isMobile = (windowWidth || 0) < 768;
  return (
    <ProjectDrawerContainer
      projectsData={props.projectsData}
      selectedProjectIndex={props.selectedProjectIndex}
      onProjectPress={onProjectPress}
    >
      {
        isMobile //if we are in mobile we need the icons above the main page content 
        &&
        <ActionIconsComponent
          projectId={props.projectsData[props.selectedProjectIndex]?.id}
          projectName={props.projectsData[props.selectedProjectIndex]?.name}
          currentSort={props.projectsData[props.selectedProjectIndex]?.orderBy}
          areThereProjects={props.projectsData.length > 0}
          isEditProjectLoading={props.isEditProjectLoading}
          isColorProjectLoading={props.isColorProjectLoading}
          isDeleteProjectLoading={props.isDeleteProjectLoading}
          projectPrimaryColor={props.projectsData[props.selectedProjectIndex]?.primaryColor}
        />
      }
      <ProjectMainContent
        selectedProjectIndex={props.selectedProjectIndex}
        projectsData={props.projectsData}
        onRefetchProjects={props.onRefetchProjects}
        isEditProjectLoading={props.isEditProjectLoading}
        isColorProjectLoading={props.isColorProjectLoading}
        isDeleteProjectLoading={props.isDeleteProjectLoading}
      />
    </ProjectDrawerContainer>
  )
}

export default Home;

const ProjectMainContent: React.FC<{
  selectedProjectIndex: number;
  projectsData: Project[] | undefined;
  onRefetchProjects: () => void;
  isEditProjectLoading: boolean;
  isDeleteProjectLoading: boolean;
  isColorProjectLoading: boolean;
}> = (props) => {
  const projectsData = props.projectsData;
  const { mutate: editDescription, isLoading: isEditDescriptionLoading } = api.projects.edit.useMutation({
    onSuccess: () => {
      props.onRefetchProjects()
    },
    onError: (e) => {
      toastTrpcError(
        "Something went wrong editing the project.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "newDescription", propertyMessage: "New Description" },
          { propertyName: "projectId", propertyMessage: "Project ID" },
        ]
      )
    }
  })

  const [windowWidth] = useWindowSize()
  if (!projectsData) {
    return <></>
  }
  const editDescriptionHandler = (newDescription: string) => {
    editDescription({
      newDescription: newDescription,
      projectId: projectsData[props.selectedProjectIndex]?.id || "-1"
    });
  }

  const {
    data: feedbacksData,
    isLoading: isFeedbackDataLoading,
    isFetched: isFeedbacksFetching,
  } = api.feedbacks.getAll.useQuery({
    projectId: projectsData[props.selectedProjectIndex]?.id || "-1"
  }, {
    onError: (e) => {
      toastTrpcError(
        "Something went wrong fetching the feedback.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "projectId", propertyMessage: "Project ID" },
        ]
      )
    },
    enabled: !!projectsData[props.selectedProjectIndex]?.id
  });


  const isNotMobile =
    (windowWidth || 0) >= 768;
  if (!projectsData.length) {
    return (<>
      {
        isNotMobile &&
        <ActionIconsComponent
          currentSort={projectsData[props.selectedProjectIndex]?.orderBy}
          projectId={projectsData[props.selectedProjectIndex]?.id}
          areThereProjects={projectsData.length > 0}
          projectName={projectsData[props.selectedProjectIndex]?.name}
          isDeleteProjectLoading={props.isDeleteProjectLoading}
          isEditProjectLoading={props.isEditProjectLoading}
          isColorProjectLoading={props.isColorProjectLoading}
          projectPrimaryColor={projectsData[props.selectedProjectIndex]?.primaryColor}
        />
      }
      <NoProjectsComponent />
    </>)
  }

  return (
    <>
      <div className="mb-3 flex">
        <div className="grow">
          <h1
            className="text-3xl font-bold"
            style={{
              color: projectsData[props.selectedProjectIndex]?.primaryColor || ""
            }}
          >
            {projectsData[props.selectedProjectIndex]?.name}
          </h1>
          <DescriptionOrAddDescriptionComponent
            projectDescription={projectsData[props.selectedProjectIndex]?.description}
            editDescription={editDescriptionHandler}
            isEditDescriptionLoading={isEditDescriptionLoading}
            projectColor={projectsData[props.selectedProjectIndex]?.primaryColor}
          />
        </div>
        {
          isNotMobile
          &&
          <ActionIconsComponent
            currentSort={projectsData[props.selectedProjectIndex]?.orderBy}
            projectId={projectsData[props.selectedProjectIndex]?.id}
            areThereProjects={projectsData.length > 0}
            projectName={projectsData[props.selectedProjectIndex]?.name}
            isEditProjectLoading={props.isEditProjectLoading}
            isDeleteProjectLoading={props.isDeleteProjectLoading}
            isColorProjectLoading={props.isColorProjectLoading}
            projectPrimaryColor={props.projectsData?.[props.selectedProjectIndex]?.primaryColor}
          />
        }
      </div>
      {
        isFeedbackDataLoading ?
          <div className="h-full w-full flex justify-center items-center">
            <LoadingIndicator color={projectsData[props.selectedProjectIndex]?.primaryColor || undefined} />
          </div>
          :
          projectsData[props.selectedProjectIndex] && feedbacksData?.length
            ?
            <FeedbackList
              feedbacksData={feedbacksData}
              sortingMethod={projectsData[props.selectedProjectIndex]?.orderBy}
              shouldSort={isFeedbacksFetching && !!feedbacksData}
              primaryColor={projectsData[props.selectedProjectIndex]?.primaryColor}
            />
            :
            <NoFeedbackComponent
              projectId={projectsData[props.selectedProjectIndex]?.id || "-1"}
              projectName={projectsData[props.selectedProjectIndex]?.name}
            />
      }
    </>
  )
}

const FeedbackList: React.FC<{
  feedbacksData: Feedback[] | undefined;
  sortingMethod: OrderBy | undefined;
  shouldSort: boolean;
  primaryColor: string | null | undefined;
}> = (props) => {
  return (
    <div className="overflow-y-auto">
      <ul className="gap-2 grid md:grid-cols-2 grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 mb-2 lg:mb-0">
        {
          props.feedbacksData?.map((feedback) => {
            return <FeedbackComponent
              key={feedback.id}
              feedback={feedback}
              primaryColor={props.primaryColor}
            />
          })
        }
      </ul>
    </div>
  )
}

const FeedbackComponent: React.FC<{
  feedback: Feedback,
  primaryColor: string | null | undefined;
}> = (props) => {
  const [isShowMore, setIsShowMore] = useState(false);
  const linesLimit = 6;
  return (
    <li key={props.feedback.id}>
      <div className="bg-base-200 rounded-xl p-2 h-full flex flex-col justify-between shadow-sm dark:bg-base-300 dark:border dark:border-zinc-700">
        <div>
          <div className="flex justify-between items-start">
            <StaticRatingComponent
              rating={props.feedback.rating}
              primaryColor={props.primaryColor}
            />
            <p className="text-zinc-500 leading-3">{timeSinceNow(props.feedback.createdAt)}</p>
          </div>
          {
            props.feedback.title ?
              <h2 className="text-xl font-bold">
                {props.feedback.title}
              </h2>
              :
              <></>
          }
          <p className={!isShowMore ? 'line-clamp-6' : ''}>
            {props.feedback.content}
          </p>
          {
            countLines(props.feedback.content) > linesLimit &&
            <div className="flex">
              <button
                className="link text-sm ml-auto text-zinc-500"
                onClick={() => {
                  setIsShowMore((prev) => !prev)
                }}
              >
                {isShowMore ? 'less' : 'more'}
              </button>
            </div>
          }
        </div>
        {
          props.feedback.author ?
            <p className="text-zinc-500 text-right italic align-text-bottom">
              {props.feedback.author}
            </p>
            :
            <div className="flex flex-row justify-end items-center gap-1">
              <BsIncognito className="text-zinc-500" />
              <p className="text-zinc-500 text-right italic align-text-bottom">
                Anonymous
              </p>
            </div>
        }
      </div>
    </li >
  )
}

const DescriptionOrAddDescriptionComponent: React.FC<{
  projectDescription: string | null | undefined;
  editDescription: (value: string) => void;
  isEditDescriptionLoading: boolean;
  projectColor: string | undefined | null;
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

  if (props.isEditDescriptionLoading) {
    return (
      <LoadingIndicator isSmall showInstantly color={props.projectColor || undefined} />
    )
  }

  return (
    <textarea
      placeholder="Add a description"
      className={
        `
        input input-ghost w-full p-0 m-0 outline-none 
        b-0 outline-0 focus:outline-0 h-6 placeholder-zinc-500 
        italic none resize-none overflow-hidden
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
      className="gap-1 btn border"
      onClick={props.onPress}
    >
      {props.children}
      <p>{props.instructionName}</p>
    </button>
  )
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
            const newProjectInput = document.getElementById('new-project-input') as HTMLInputElement | null;
            if (newProjectInput) {
              newProjectInput.focus();
            }
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


const ProjectDrawerContainer: React.FC<{
  projectsData: Project[] | undefined;
  selectedProjectIndex: number;
  onProjectPress: (i: number) => void;
  children: React.ReactNode;
}> = (props) => {
  const { mutate: createProject, isLoading: isNewProjectsLoading } = api.projects.create.useMutation({
    onError: (e) => {
      toastTrpcError(
        "Something went wrong creating the project.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "name", propertyMessage: "Project name" },
        ]
      )
    }
  })
  const { refetch: refetchProjects } = api.projects.getAll.useQuery();

  const projectSubmitHandler = (projectTitle: string) => {
    if (!projectTitle.length) {
      return;
    }
    createProject({ name: projectTitle }, {
      onSuccess: () => {
        void refetchProjects();
        props.onProjectPress(0);
      },
    });
  }

  const [newProjectInputValue, setNewProjectInputValue] = useState("");
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
          <form className="flex gap-1">
            <Input
              name="New Project"
              id="new-project-input"
              className={`flex-grow`}
              type="text"
              autoFocus={props.projectsData?.length === 0}
              onChange={(value) => {
                setNewProjectInputValue(value)
              }}
              maxLength={maxTitleLength}
              labelDisabled
              placeholder="New Project"
              value={newProjectInputValue}
              onSubmit={() => {
                projectSubmitHandler(newProjectInputValue);
                setNewProjectInputValue("")
              }}
            />
            <button type="submit" onClick={(e) => {
              e.preventDefault();
              projectSubmitHandler(newProjectInputValue);
              setNewProjectInputValue("")
            }}
              disabled={!newProjectInputValue.length}
              className={newProjectInputValue.length ? 'cursor-pointer' : 'cursor-not-allowed'}
            >
              <BiCheck size={32} className={newProjectInputValue.length > 0 ? "text-success" : ""} />
            </button>
          </form>
          <div className="divider mt-2 mb-2" />
          {
            (isNewProjectsLoading) ?
              <div className="flex justify-center">
                <LoadingIndicator
                  showInstantly
                  color={props.projectsData?.[props.selectedProjectIndex]?.primaryColor || undefined}
                />
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
      <UTellMeComponentButton hasText />
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
        <li>
          <Link href="/settings" className="flex justify-between">
            <p>Settings</p>
            <FiSettings />
          </Link>
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
        style={{
          backgroundColor: props.isActive ? props.project.primaryColor || "" : ""
        }}
        className={`${props.isActive ? "active bg-primary font-semibold" : "font-medium"}`}
        onClick={() => props.onPress(props.index)}
      >
        {props.project.name}
      </a>
    </li>
  )
}
