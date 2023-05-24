import type { OrderBy } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { BiColorFill, BiEdit, BiInfoCircle, BiMenu, BiQr, BiShareAlt, BiSortAlt2, BiSortDown, BiSortUp, BiTrash } from "react-icons/bi";
import { api } from "~/utils/api";
import { getProjectUrl, onGenerateQr, shareOrCopyToClipboard, toastTrpcError } from "~/utils/functions";
import { useWindowSize } from "~/utils/hooks";
import LoadingIndicator from "./LoadingIndicator";
import { SwitchComponent } from "./SwitchComponent";

//import everything missing

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

  const {
    data: subscriptionStatus
  } = api.user.subscriptionStatus.useQuery();
  const isSubscribed = subscriptionStatus === "active"

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
              isSubscribed={isSubscribed}
              onPress={() => {
                void onGenerateQr(props.projectId || "-1", props.projectName || "this project");
              }}
              tooltipName="Generate QR"
            >
              <BiQr size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              isSubscribed={isSubscribed}
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
            <SingleActionIcon
              tooltipName="project info"
              needsPro
              isSubscribed={isSubscribed}
              modalId="info-project-modal"
            >
              <BiInfoCircle size={26} />
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="Customize colors"
              isSubscribed={isSubscribed}
              needsPro
              modalId="color-project-modal"
            >
              {
                props.isColorProjectLoading ?
                  <LoadingIndicator
                    isSmall
                    showInstantly
                    color={props.projectPrimaryColor || undefined}
                  /> :
                  <BiColorFill size={26} />
              }
            </SingleActionIcon>
            <SingleActionIcon
              isSubscribed={isSubscribed}
              tooltipName="Edit Project"
              modalId="edit-project-modal"
            >
              {
                props.isEditProjectLoading ?
                  <LoadingIndicator
                    isSmall
                    showInstantly
                    color={props.projectPrimaryColor || undefined}
                  />
                  :
                  <BiEdit size={26} />
              }
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="Delete Project"
              modalId="delete-project-modal"
              isSubscribed={isSubscribed}
            >
              {
                props.isDeleteProjectLoading ?
                  <LoadingIndicator isSmall showInstantly color={props.projectPrimaryColor || undefined} />
                  :
                  <BiTrash size={26} />
              }
            </SingleActionIcon>
            <SingleActionIcon
              tooltipName="sort"
              needsPro
              isSubscribed={isSubscribed}
            >
              <DropdownSort
                currentSort={props.currentSort}
                projectId={props.projectId}
                needsPro
                projectPrimaryColor={props.projectPrimaryColor}
                isSubscribed={isSubscribed}
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

export const SingleActionIcon: React.FC<{
  children: React.ReactNode;
  onPress?: () => void;
  tooltipName?: string;
  isTooltipSuccess?: boolean;
  needsPro?: boolean;
  isSubscribed?: boolean;
  modalId?: string;
}> = (props) => {
  const isForbidden = props.needsPro && !props.isSubscribed;
  return (
    <div
      className={`${!!props.tooltipName ? ' md:tooltip md:tooltip-left' : ''} cursor-pointer`}
      data-tip={props.tooltipName?.toLowerCase()}
    >
      {
        isForbidden
          ?
          <label htmlFor="need-subscription-modal" className="cursor-pointer">
            {props.children}
          </label>
          :
          <a className="cursor-pointer" onClick={() => {
            props.onPress && props.onPress()
          }
          }>
            {
              props.modalId ?
                <label htmlFor={props.modalId} className="cursor-pointer">{props.children}</label>
                :
                props.children
            }
          </a>
      }
    </div>
  )
}

const DropdownSort: React.FC<{
  currentSort: OrderBy | undefined;
  projectId: string | undefined;
  projectPrimaryColor: string | null | undefined;
  isSubscribed: boolean;
  needsPro?: boolean;
}> = (props) => {
  const [isLoading, setIsLoading] = useState(false);

  if (!props.isSubscribed && props.needsPro) {
    return (
      isLoading ? <LoadingIndicator
        isSmall
        showInstantly
        color={props.projectPrimaryColor || undefined}
      /> :
        <BiSortAlt2 size={26} />
    )
  }

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

export default ActionIconsComponent;
