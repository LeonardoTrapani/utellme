import type { Project } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Modal, { ModalActionButton } from "./Modal";
import Image from "next/image";
import { ChromePicker } from "react-color";
import { BiMoon, BiReset, BiSun } from "react-icons/bi";
import Input from "./Input";
import { useIsDarkMode } from "~/utils/hooks";
import { StaticRatingComponent } from "./RatingComponent";
import { api } from "~/utils/api";
import LoadingIndicator from "./LoadingIndicator";

const DashboardModals: React.FC<{
  projectDeleteHandler: () => void;
  projects: Project[] | undefined;
  selectedProjectIndex: number;
  deleteModalHasError: boolean;
  setDeleteModalHasError: (val: boolean) => void;
  resetDeleteModalState: () => void;
  setDeleteModalInputValue: (val: string) => void;
  deleteModalInputValue: string;
  resetEditModalState: () => void;
  setEditProjectDescriptionValue: (val: string) => void;
  editProjectNameHasError: boolean;
  isSubscribed: boolean;
  setEditProjectNameValue: (value: string) => void;
  editProjectNameValue: string;
  editProjectDescriptionValue: string;
  projectEditHandler: () => void;
  editProjectMessageValue: string;
  setEditProjectNameHasError: (val: boolean) => void;
  setEditProjectMessageValue: (val: string) => void;
  handleEditColorProject: () => void;
  projectBackgroundColorValue: string | null;
  projectPrimaryColorValue: string | null;
  projectTextColorValue: string | null;
  setProjectBackgroundColorValue: (string: string | null) => void;
  setProjectPrimaryColorValue: (string: string | null) => void;
  setProjectTextColorValue: (string: string | null) => void;
  createCheckoutSession: () => void;
}> = ({
  projectDeleteHandler,
  projects,
  selectedProjectIndex,
  setDeleteModalInputValue,
  resetDeleteModalState,
  setDeleteModalHasError,
  deleteModalHasError,
  deleteModalInputValue,
  setEditProjectDescriptionValue,
  resetEditModalState,
  isSubscribed,
  editProjectNameHasError,
  editProjectMessageValue,
  projectEditHandler,
  editProjectDescriptionValue,
  editProjectNameValue,
  setEditProjectNameValue,
  setEditProjectNameHasError,
  setEditProjectMessageValue,
  handleEditColorProject,
  setProjectTextColorValue,
  setProjectPrimaryColorValue,
  setProjectBackgroundColorValue,
  projectTextColorValue,
  projectPrimaryColorValue,
  projectBackgroundColorValue,
  createCheckoutSession,
}) => {
    return (
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
          isSubscribed={isSubscribed}
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
        {
          !isSubscribed &&
          <Modal
            id="need-subscription-modal"
            cancelButton={{
              text: "cancel",
              modalId: "need-subscription-modal"
            }}
            confirmButton={{
              text: "upgrade account",
              modalId: "need-subscription-modal",
              onClick: () => createCheckoutSession(),
              isPrimary: true
            }}
          >
            <h3 className="text-2xl font-semibold">Upgrade Account</h3>
            <div className="divider" />
            <p className="mb-4">You need a UTellMe Pro account to access this functionality</p>
          </Modal>
        }
        <InfoProjectModal projectId={projects?.[selectedProjectIndex]?.id} />
      </>
    );
  };

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
  isSubscribed: boolean;
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
            <button
              disabled={props.isSubscribed}
              onClick={() => {
                if (props.isSubscribed) return;
                const editModalElement = document.getElementById('edit-project-modal') as HTMLInputElement | null;
                if (editModalElement) {
                  editModalElement.checked = false;
                }
                const needSubscriptionModalElement = document.getElementById('need-subscription-modal') as HTMLInputElement | null;
                if (needSubscriptionModalElement) {
                  needSubscriptionModalElement.checked = true;
                }
              }}>
              <Input
                name="Message"
                placeholder='example: "Tell me your feedback about"'
                isDisabled={!props.isSubscribed}
                onChange={(value) => {
                  props.setMessageInputValue(value);
                }}
                value={props.messageInputValue}
                maxLength={75}
              />
            </button>
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

export default DashboardModals;
