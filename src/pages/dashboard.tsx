import type { NextPage } from "next";
import Head from "next/head";
import type { GetServerSidePropsContext } from "next";
import { authOptions } from "~/server/auth";

import { signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useEffect, useRef, useState } from "react";
import { BiEdit, BiMenu, BiTrash, BiQr, BiShareAlt, BiCheck, BiInfoCircle, BiSortUp, BiSortDown, BiSortAlt2, BiColorFill, BiReset, BiSun, BiMoon } from "react-icons/bi"
import { BsIncognito } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import type { Feedback, OrderBy, Project } from "@prisma/client";
import { StaticRatingComponent } from "~/components/RatingComponent";
import LoadingIndicator from "~/components/LoadingIndicator";
import Avatar from "~/components/Avatar";

import { BiLogOut } from "react-icons/bi";
import { useIsDarkMode, useWindowSize } from "~/utils/hooks";
import { toast } from "react-hot-toast";
import QRCode from 'qrcode'
import Input from "~/components/Input";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { countLines, timeSinceNow, toastTrpcError } from "~/utils/functions";
import { SwitchComponent } from "~/components/SwitchComponent";
import { getServerSession } from "next-auth";
import Link from "next/link";
import Modal, { ModalActionButton } from "~/components/Modal";
import { ChromePicker } from "react-color";
import Image from "next/image";

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
            {
              <>
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
                  projectMessage={projects?.[selectedProjectIndex]?.message || 'Project message'}
                  resetModalState={resetEditModalState}
                  setDescriptionInputValue={setEditProjectDescriptionValue}
                  setNameInputValue={setEditProjectNameValue}
                  nameInputValue={editProjectNameValue}
                  descriptionInputValue={editProjectDescriptionValue}
                  onEdit={projectEditHandler}
                  editProjectNameHasError={editProjectNameHasError}
                  setNameInputHasError={(value) => { setEditProjectNameHasError(value) }}
                  setMessageInputValue={(value) => { setEditProjectMessageValue(value) }}
                  messageInputValue={editProjectMessageValue}
                />
                <Modal
                  id="color-project-modal"
                  cancelButton={{
                    text: "cancel",
                    modalId: "color-project-modal",
                  }}
                  confirmButton={{
                    onClick: handleEditColorProject,
                    text: "confirm",
                    modalId: "color-project-modal",
                    isPrimary: true,
                  }}
                >
                  <ColorProjectModalBody
                    projectDescription={projects?.[selectedProjectIndex]?.description}
                    projectName={projects?.[selectedProjectIndex]?.name}
                    projectBackgroundColorValue={projectBackgroundColorValue}
                    projectPrimaryColorValue={projectPrimaryColorValue}
                    projectTextColorValue={projectTextColorValue}
                    setProjectBackgroundColorValue={(value) => setProjectBackgroundColorValue(value)}
                    setProjectTitleColorValue={(value) => setProjectPrimaryColorValue(value)}
                    setProjectTextColorValue={(value) => setProjectTextColorValue(value)}
                  />
                </Modal>
                <InfoProjectModal projectId={projects?.[selectedProjectIndex]?.id} />
              </>
            }
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

  return (
    <ProjectDrawerContainer
      projectsData={props.projectsData}
      selectedProjectIndex={props.selectedProjectIndex}
      onProjectPress={onProjectPress}
    >
      {
        (windowWidth || 0) < 768 //if we are in mobile we need the icons above the main page content 
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

const closeDrawer = () => {
  const drawer = document.getElementById('drawer') as HTMLInputElement || undefined;
  if (drawer) {
    drawer.checked = false;
  }
}

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
    if (value.trim() === props.projectTitle.trim()) {
      props.resetModalState()
      props.onDelete();
    } else {
      props.setModalHasError(true);
    }
  }


  return (
    <>
      <input type="checkbox" id="delete-project-modal" className="modal-toggle overflow-x-hidden" />
      <label htmlFor="delete-project-modal" className="modal cursor-pointer overflow-x-hidden">
        <label className="modal-box relative">
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
              autoFocus
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
              text="cancel"
            />
            <ModalActionButton
              modalId="delete-project-modal"
              isRed
              onClick={() => deleteHandler()}
              disableClose
              text="confirm"
            />
          </div>
        </label>
      </label>
    </>
  )
}

const ColorProjectModalBody: React.FC<{
  projectName: string | null | undefined;
  projectDescription: string | null | undefined;
  projectBackgroundColorValue: string | null;
  projectTextColorValue: string | null;
  projectPrimaryColorValue: string | null;
  setProjectBackgroundColorValue: (value: string | null) => void;
  setProjectTextColorValue: (value: string | null) => void;
  setProjectTitleColorValue: (value: string | null) => void;
}> = (props) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 overflow-x-hidden">
      <input disabled className="hidden" /> {/*necessary to avoid bugs of text color input automatically focusing*/}
      <PickColorRow
        text="Primary Color"
        currentColor={props.projectPrimaryColorValue}
        onColorChange={(value) => {
          props.setProjectTitleColorValue(value)
        }}
        onReset={() => {
          props.setProjectTitleColorValue(null);
        }}
      />
      {
        isAdvancedOpen &&
        <>
          <p className="text-sm text-zinc-500">We don&apos;t suggest changing this settings. Double check the preview of both themes to make sure that all the content is visible in all cases</p>

          <PickColorRow
            text="Text Color"
            currentColor={props.projectTextColorValue}
            onReset={() => {
              props.setProjectTextColorValue(null);
            }}
            onColorChange={(value) => {
              props.setProjectTextColorValue(value)
            }}
          />
          <PickColorRow
            text="Background Color"
            currentColor={props.projectBackgroundColorValue}
            onColorChange={(value) => {
              props.setProjectBackgroundColorValue(value)
            }}
            onReset={() => {
              props.setProjectBackgroundColorValue(null);
            }}
          />
        </>
      }
      <button
        className="text-center link text-sm"
        onClick={() => {
          setIsAdvancedOpen((prev) => !prev)
        }}
      >
        {isAdvancedOpen ? 'close advanced options' : 'open advanced options'}
      </button>
      <div className="divider my-0" />
      <div>
        <h4 className="text-center mb-1 text-lg font-semibold uppercase">Preview</h4>
        <div className="border rounded-lg dark:border-zinc-600">
          <ColorPreview
            projectTitle={props.projectName}
            projectDescription={props.projectDescription}
            textColor={props.projectTextColorValue}
            backgroundColor={props.projectBackgroundColorValue}
            primaryColor={props.projectPrimaryColorValue}
          />
        </div>
      </div>
    </div>
  )
};

const PickColorRow: React.FC<{
  text: string;
  currentColor: string | null;
  onColorChange: (color: string) => void;
  onReset: () => void;
}> = (props) => {
  return (
    <div className="flex gap-2 justify-between items-center">
      <p className="font-semibold">{props.text}</p>
      <div className="flex items-center gap-2">
        <div className="dropdown dropdown-end">

          <label
            className="block red-50 rounded-full w-9 h-9 border cursor-pointer hover:scale-110 transition-all"
            tabIndex={0}
            style={{
              backgroundColor: props.currentColor || undefined
            }}
          >
            {
              !props.currentColor ?
                <Image
                  src="/assets/transparent.png"
                  alt="transparent background"
                  height={36}
                  width={36}
                  className="block red-50 rounded-full w-9 h-9 border"
                /> : <></>
            }
          </label>
          <div tabIndex={0} className="dropdown-content shadow">
            <ChromePicker
              onChange={(color) => {
                props.onColorChange(color.hex);
              }}
              color={props.currentColor || undefined}
            />
          </div>
        </div>
        <button onClick={() => {
          props.onReset();
        }}>
          <BiReset size={24} className="text-zinc-500" />
        </button>
      </div>
    </div >

  )
}

const EditProjectModal: React.FC<{
  resetModalState: () => void;
  projectDescription: string;
  projectName: string;
  projectMessage: string;
  setDescriptionInputValue: (value: string) => void;
  setNameInputValue: (value: string) => void;
  descriptionInputValue: string;
  nameInputValue: string;
  onEdit: () => void;
  editProjectNameHasError: boolean;
  setNameInputHasError: (hasError: boolean) => void;
  setMessageInputValue: (value: string) => void;
  messageInputValue: string;
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
        <label className="modal-box relative">
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
              className={`mt-2 textarea textarea-bordered textarea-md w-full placeholder:text-zinc-500`}
              onChange={(e) => props.setDescriptionInputValue(e.target.value)}
              rows={6}
              value={props.descriptionInputValue}
            />
            <Input
              name="Message"
              placeholder="Tell me your feedback about"
              onChange={(value) => {
                props.setMessageInputValue(value);
              }}
              value={props.messageInputValue}
              maxLength={75}
            />
          </div>
          <div className="modal-action">
            <ModalActionButton
              modalId="edit-project-modal"
              onClick={props.resetModalState}
              text="Cancel"
            />
            <ModalActionButton
              modalId="edit-project-modal"
              isPrimary
              onClick={() => editHandler()}
              disableClose
              text="confirm"
            />
          </div>
        </label>
      </label>
    </>
  )
}

const ColorPreview: React.FC<{
  projectTitle: string | null | undefined;
  projectDescription: string | null | undefined;
  primaryColor: string | null | undefined;
  backgroundColor: string | null | undefined;
  textColor: string | null | undefined;
}> = (props) => {
  const isDarkModeInitial = useIsDarkMode()
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkModeInitial);
  useEffect(() => {
    setIsDarkTheme(isDarkModeInitial);
  }, [isDarkModeInitial])

  const backgroundColorDark = "#212121";
  const backgroundColorLight = "#FFFFFF";
  const textColorLight = "#212936";
  const textColorDark = "#D3D3D3";
  const labelColorDark = "#1A1A1A";
  const labelColorLight = "#E5E6E6";
  const inputInternalColorLight = "#D8D8DB";
  const inputBorderColorDark = "#4A4A4A";
  const inputBorderColorLight = "#D8D8DB";

  return (
    <div
      className={`h-full relative rounded-xl p-6`}
      style={{
        backgroundColor: props.backgroundColor || (
          isDarkTheme ? backgroundColorDark : backgroundColorLight
        ),
        color: props.textColor || (
          isDarkTheme ? textColorDark : textColorLight
        )
      }}
    >
      <button
        className={"btn btn-circle absolute h-10 aspect-square right-2 top-2 flex justify-center items-center rounded-full shadow-lg border"}
        onClick={() => {
          setIsDarkTheme((prev) => !prev);
        }}
      >
        {
          isDarkTheme ?
            <BiSun />
            :
            <BiMoon />
        }
      </button>
      <div className="flex flex-col gap-4">
        <h3
          className="text-xl font-bold"
          style={{
            color: props.primaryColor || undefined
          }}
        >
          {props.projectTitle}
        </h3>
        <h3
          className=""
          style={{
            color: props.textColor || undefined
          }}
        >
          {`${props.projectDescription?.substring(0, 100) || "This is a test description"} ${props.projectDescription?.length && props.projectDescription?.length > 100 ? "..." : ""}`}
        </h3>

        <StaticRatingComponent
          rating={3}
          primaryColor={props.primaryColor}
          isDark={isDarkTheme}
        />

        <Input
          isDisabled
          name="Preview"
          value="This is a preview"
          placeholder="This is a preview"
          labelColor={isDarkTheme ? labelColorDark : labelColorLight}
          borderColor={
            isDarkTheme ? inputBorderColorDark : inputBorderColorLight
          }
          internalColor={props.backgroundColor ?
            props.backgroundColor :
            isDarkTheme ? backgroundColorDark : inputInternalColorLight
          }
        />
      </div>
    </div>
  )
};

const InfoProjectModal: React.FC<{
  projectId: string | undefined;
}> = (props) => {
  const { data: projectInfo, isLoading: isProjectInfoLoading } = api.projects.getInfo.useQuery({ projectId: props.projectId || "" }, {
    enabled: !!props.projectId
  });

  return (
    <>
      <input type="checkbox" id="info-project-modal" className="modal-toggle" />
      <label htmlFor="info-project-modal" className="modal cursor-pointer">
        <label className="modal-box relative">
          {isProjectInfoLoading || !projectInfo ? (
            <LoadingIndicator color={projectInfo?.primaryColor || undefined} />
          ) : (
            <div>
              <h2 className="text-xl font-bold">{projectInfo.name}</h2>
              <p className="italic">{projectInfo.description}</p>
              <div className="divider" />
              <div className="flex justify-between items-center">
                <p>Average Rating:</p>
                <p className="font-bold">{projectInfo.averageRating ? projectInfo.averageRating.toFixed(1) : "N/A"}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Created At:</p>
                <p className="font-bold">{projectInfo.createdAt.toDateString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Feedback received:</p>
                <p className="font-bold">{projectInfo._count.feedbacks}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>ID:</p>
                <p className="font-bold">{projectInfo.id}</p>
              </div>
            </div>
          )}
        </label>
      </label>
    </>
  )
}

const SortContent: React.FC<{
  currentSort: OrderBy | undefined;
  projectId: string | undefined;
  onLoadingChange: (value: boolean) => void;
}> = (props) => {
  const [isAscending, setIsAscending] = useState(
    props.currentSort === "ratingAsc" || props.currentSort === "createdAtAsc"
  );
  const [isSortingByRating, setIsSortingByRating] = useState(
    props.currentSort === 'ratingAsc' || props.currentSort === 'ratingDesc'
  );

  useEffect(() => {
    if (props.currentSort === 'ratingAsc' || props.currentSort === 'ratingDesc') {
      setIsSortingByRating(true);
    } else {
      setIsSortingByRating(false);
    }
    if (props.currentSort === 'ratingAsc' || props.currentSort === 'createdAtAsc') {
      setIsAscending(true);
    } else {
      setIsAscending(false);
    }
  }, [props.currentSort])

  const {
    refetch: refetchFeedback
  } = api.feedbacks.getAll.useQuery({
    projectId: props.projectId || "-1"
  }, {
    enabled: !!props.projectId,
    onError: (e) => {
      toastTrpcError(
        "Something went wrong fetching the feedback.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "projectId", propertyMessage: "Project ID" },
        ]
      )
    }
  });

  const {
    refetch: refetchProjects
  } = api.projects.getAll.useQuery(undefined, {
    enabled: !!props.projectId,
    onError: () => {
      toastTrpcError(
        "Something went wrong fetching the feedback.",
        undefined,
        []
      )
    }
  });

  const {
    mutate: editProject,
    isLoading: isEditProjectLoading
  } = api.projects.edit.useMutation({
    onError: (e) => {
      toastTrpcError(
        "Something went wrong changing the sort.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "projectId", propertyMessage: "Project ID" },
          { propertyName: "newOrderBy", propertyMessage: "New Sort" },
        ]
      )
    },
    onSuccess: async () => {
      await refetchProjects();
      void refetchFeedback();
    }
  });

  useEffect(() => {
    props.onLoadingChange(isEditProjectLoading)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditProjectLoading])

  const onChangeSort = (isSortingByRatingLocal: boolean, isAscendingLocal: boolean) => {
    closeDropdown();
    let currentSort: OrderBy;
    if (isSortingByRatingLocal) {
      if (isAscendingLocal) {
        currentSort = 'ratingAsc';
      } else {
        currentSort = 'ratingDesc';
      }
    } else {
      if (isAscendingLocal) {
        currentSort = 'createdAtAsc';
      } else {
        currentSort = 'createdAtDesc';
      }
    }
    editProject({
      projectId: props.projectId || '-1',
      newOrderBy: currentSort
    })
  }

  return (
    <div className="flex gap-4">
      <select
        className="select select-bordered grow outline-none focus:outline-none"
        onChange={(e) => {
          onChangeSort(e.currentTarget.value === 'Rating', isAscending);
          e.currentTarget.value === 'Rating' ? setIsSortingByRating(true) : setIsSortingByRating(false);
        }}
        value={isSortingByRating ? 'Rating' : 'Created Time'}
      >
        <option disabled>Sort By</option>
        <option>Created Time</option>
        <option>Rating</option>
      </select>
      <SwitchComponent
        activeFirst={isAscending}
        first={<BiSortUp size={28} />}
        second={<BiSortDown size={28} />}
        onSwitch={() => {
          onChangeSort(isSortingByRating, !isAscending)
          setIsAscending((prevState) => !prevState)
        }}
      />
    </div>
  )
}

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


  if (!projectsData.length) {
    return (<>
      {
        (windowWidth || 0) >= 768
          ?
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
          :
          <></>
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
          >{projectsData[props.selectedProjectIndex]?.name}</h1>
          {
            <DescriptionOrAddDescriptionComponent
              projectDescription={projectsData[props.selectedProjectIndex]?.description}
              editDescription={editDescriptionHandler}
              isEditDescriptionLoading={isEditDescriptionLoading}
              projectColor={projectsData[props.selectedProjectIndex]?.primaryColor}
            />
          }
        </div>
        {
          (windowWidth || 0) >= 768
            ?
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
            :
            <></>
        }
      </div>
      {
        (
          (
            isFeedbackDataLoading ?
              <div className="h-full w-full flex justify-center items-center">
                <LoadingIndicator color={projectsData[props.selectedProjectIndex]?.primaryColor || undefined} />
              </div>
              :
              (

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
              )
          )
        )
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

const onGenerateQr = async (projectId: string, projectName: string) => {
  const projectLink = getProjectUrl(projectId);
  try {
    const qrImage = await QRCode.toDataURL(
      projectLink,
      { type: 'image/png' },
    )
    await shareOrCopyToClipboard({
      title: `${projectName}'s QR-Code`,
      isFile: true,
      fileName: `${projectName}'s QR-Code.png`,
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
}: {
  text: string,
  title?: string,
  isFile?: boolean
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
  };
  if (navigator.share && navigator.canShare(shareData)) {
    void navigator.share({
      title,
      url: text,
    })
  } else {
    void copyToClipboard(text);
  }
}

const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text)
  toast('Copied to the clipboard!')
}

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

  // Clean up and remove the link
  link.parentNode?.removeChild(link);
}

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

const ActionIconsComponent: React.FC<{
  projectId: string | undefined;
  areThereProjects: boolean;
  projectName: string | undefined;
  currentSort: OrderBy | undefined;
  isDeleteProjectLoading: boolean;
  isColorProjectLoading: boolean;
  isEditProjectLoading: boolean;
  projectPrimaryColor: string | null | undefined;
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
            <SingleActionIcon tooltipName="project info">
              <label htmlFor="info-project-modal" className="cursor-pointer">
                <BiInfoCircle size={26} />
              </label>
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="Customize colors"
            >
              {
                props.isColorProjectLoading ?
                  <LoadingIndicator
                    isSmall
                    showInstantly
                    color={props.projectPrimaryColor || undefined}
                  /> :
                  <label htmlFor="color-project-modal" className="cursor-pointer">
                    <BiColorFill size={26} />
                  </label>
              }
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="Edit Project"
            >
              {
                props.isEditProjectLoading ?
                  <LoadingIndicator
                    isSmall
                    showInstantly
                    color={props.projectPrimaryColor || undefined}
                  />
                  :
                  <label htmlFor="edit-project-modal" className="cursor-pointer">
                    <BiEdit size={26} />
                  </label>
              }
            </SingleActionIcon>
            <DeleteProjectActionIcon
              tooltipName="Delete Project"
            >
              {
                props.isDeleteProjectLoading ?
                  <LoadingIndicator isSmall showInstantly color={props.projectPrimaryColor || undefined} />
                  :
                  <label htmlFor="delete-project-modal" className="cursor-pointer">
                    <BiTrash size={26} />
                  </label>
              }
            </DeleteProjectActionIcon>
            <SingleActionIcon tooltipName="sort">
              <DropdownSort
                currentSort={props.currentSort}
                projectId={props.projectId}
                projectPrimaryColor={props.projectPrimaryColor}
              />
            </SingleActionIcon>
          </>
        )
      }
      {
        !isBig && <label htmlFor="drawer" className="cursor-pointer">
          <OpenMenuButton />
        </label>
      }
    </div >
  )
}

const DropdownSort: React.FC<{
  currentSort: OrderBy | undefined;
  projectId: string | undefined;
  projectPrimaryColor: string | null | undefined;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="dropdown dropdown-end flex">
      <label tabIndex={0} className="cursor-pointer">
        {
          isLoading ? <LoadingIndicator
            isSmall
            showInstantly
            color={props.projectPrimaryColor || undefined}
          /> :
            <BiSortAlt2 size={26} />
        }
      </label>
      <div
        id='sort-dropdown'
        tabIndex={0}
        className="dropdown-content bg-base-300 menu p-2 shadow rounded-box w-52">
        <SortContent
          currentSort={props.currentSort}
          onLoadingChange={(value) => {
            setIsLoading(value)
          }}
          projectId={props.projectId}
        />
      </div>
    </div>
  )
}
const closeDropdown = () => {
  const dropdown = document.activeElement as HTMLDivElement | undefined;
  if (dropdown) {
    dropdown.blur();
  }
}

const OpenMenuButton = () => {
  return (
    <div className="flex bg-base-300 rounded-full items-center justify-center pl-2 pr-1 text-center py-1 dark:border dark:border-zinc-700">
      <p className="align-middle font-bold">MENU</p>
      <BiMenu className="text-primary" size={24} />
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
      className={`${!!props.tooltipName ? ' md:tooltip md:tooltip-left' : ''} cursor-pointer`}
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
