import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "~/components/Input";
import LoadingIndicator from "~/components/LoadingIndicator";
import NotFoundPage from "~/components/NotFoundPage";
import { SelectRatingComponent, } from "~/components/RatingComponent";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { api } from "~/utils/api";
import { toastTrpcError } from "~/utils/functions";

const NewFeedbackPage: NextPage = () => {
  const [hasGivenFeedback, setHasGivenFeedback] = React.useState(false);

  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [feedbackContent, setFeedbackContent] = React.useState<string | undefined>(undefined);
  const [feedbackTitle, setFeedbackTitle] = React.useState<string | undefined>(undefined);
  const [feedbackAuthor, setFeedbackAuthor] = React.useState<string | undefined>(undefined);

  const [contentHasError, setContentHasError] = React.useState(false);
  const [ratingHasError, setRatingHasError] = React.useState(false);

  const router = useRouter();
  const projectId = Array.isArray(router.query.projectId) ? router.query.projectId[0] : router.query.projectId;

  const { data: project, isLoading: isProjectLoading } =
    api.projects.getPublicInfo.useQuery({
      projectId: projectId || "-1"
    }, {
      enabled: !!projectId,
      onError: (e) => {
        toastTrpcError(
          "Something went wrong fetching the project.",
          e.data?.zodError?.fieldErrors,
          [
            { propertyName: "projectId", propertyMessage: "Project ID" },
          ]
        )
      }

    });

  const { mutate: createFeedback, isLoading: isCreateFeedbackLoading } = api.feedbacks.create.useMutation({
    onSuccess: () => {
      setHasGivenFeedback(true);
    },
    onError: (e) => {
      toastTrpcError(
        "Something went wrong sending the feedback.",
        e.data?.zodError?.fieldErrors,
        [
          { propertyName: "title", propertyMessage: "Feedback's Title" },
          { propertyName: "content", propertyMessage: "Feedback's Content" },
          { propertyName: "rating", propertyMessage: "Feedback's Rating" },
          { propertyName: "author", propertyMessage: "Feedback's Author" },
          { propertyName: "projectId", propertyMessage: "Project's ID" },
        ]
      )
    }
  })

  const submitFeedbackHandler = () => {
    if (!project) return;
    if (!feedbackContent) {
      setContentHasError(true);
    }
    if (!rating) {
      setRatingHasError(true);
    }
    if (!feedbackContent || !rating) return;

    createFeedback({
      title: feedbackTitle,
      content: feedbackContent,
      rating: rating,
      author: feedbackAuthor,
      projectId: project.id
    })
  }

  const projectDoesNotExist = !isProjectLoading && !project;
  useEffect(() => {
    if (projectDoesNotExist) {
      toast.error('Project not found... is the link wrong?')
    }
  }, [projectDoesNotExist])

  useEffect(() => {
    if (!document) return;
    const htmlElement = document.getElementsByTagName("html")[0] as HTMLElement;
    if (project?.backgroundColor) {
      htmlElement.style.backgroundColor = project.backgroundColor;
    }
  }, [project])
  useEffect(() => {
    return () => {
      if (!document) return;
      const htmlElement = document.getElementsByTagName("html")[0] as HTMLElement;
      htmlElement.style.backgroundColor = "";
    }
  }, [])

  return (
    <>
      <Head>
        <title>{project?.name || "uTellMe"}</title>
        <meta name="description" content={`Give feedback to ${project?.name || "my prject"} with uTellMe`} />
      </Head>
      <main
        className="min-h-screen"
      >
        {
          isProjectLoading || isCreateFeedbackLoading ?
            <div className="flex items-center justify-center h-screen">
              <LoadingIndicator />
            </div> :
            (projectDoesNotExist) ? <NotFoundPage /> :
              (
                !hasGivenFeedback ?
                  <MainGetFeedbackContent
                    publicProjectInfo={project}
                    currentRating={rating}
                    setRating={(rating) => {
                      setRating(rating);
                      setRatingHasError(false);
                    }}
                    onSubmitFeedback={submitFeedbackHandler}
                    setFeedbackTitle={(title) => setFeedbackTitle(title)}
                    setFeedbackAuthor={(author) => setFeedbackAuthor(author)}
                    setFeedbackContent={(content) => {
                      setFeedbackContent(content);
                      setContentHasError(false);
                    }}
                    contentHasError={contentHasError}
                    ratingHasError={ratingHasError}
                  /> :
                  <FeedbackCompletedPage
                    publicProjectInfo={project}
                  />
              )
        }
      </main >
    </>
  )
}

type PublicProjectInfoType = {
  id: string;
  name: string;
  description: string | null;
  message: string | null;
  backgroundColor: string | null;
  textColor: string | null;
} | null | undefined

const MainGetFeedbackContent: React.FC<{
  publicProjectInfo: PublicProjectInfoType;
  currentRating: number | undefined;
  onSubmitFeedback: () => void;
  setRating: (rating: number) => void;
  setFeedbackTitle: (title: string) => void;
  setFeedbackAuthor: (author: string) => void;
  setFeedbackContent: (content: string) => void;
  contentHasError: boolean;
  ratingHasError: boolean;
}> = (props) => {
  const [textAreaPlaceHolder, setTextAreaPlaceHolder] = useState("This is my feedback about this project");
  useEffect(() => {
    const projectName = props.publicProjectInfo?.name || "this project";
    if (!props.currentRating) {
      setTextAreaPlaceHolder(`What did I like about ${projectName}? What can be improved?`);
    }
    if (props.currentRating === 1) {
      setTextAreaPlaceHolder(`I hated ${projectName} because...`);
    }
    if (props.currentRating === 2) {
      setTextAreaPlaceHolder(`I didn't like ${projectName} because...`);
    }
    if (props.currentRating === 3) {
      setTextAreaPlaceHolder(`I was indifferent ${projectName} because...`);
    }
    if (props.currentRating === 4) {
      setTextAreaPlaceHolder(`I liked ${projectName} because...`);
    }
    if (props.currentRating === 5) {
      setTextAreaPlaceHolder(`I loved ${projectName} because...`);
    }
  }, [props.currentRating, props.publicProjectInfo?.name]);

  return (
    <div
      className="max-w-xl md:max-w-3xl m-auto p-4 rounded-xl"
    >
      <GetFeedbackTitle publicProjectInfo={props.publicProjectInfo} />
      <div className="divider mt-2 mb-2" />
      <div className={`h-10 items-center w-min m-auto rounded-xl mb-2 ${props.ratingHasError ? "border-error border-2" : ""}`}>
        <SelectRatingComponent
          rating={props.currentRating}
          onRatingChange={(rating) => {
            props.setRating(rating);
          }}
        />
      </div>
      <form>
        <div className="form-control gap-4">
          <textarea placeholder={textAreaPlaceHolder}
            className={`mt-2 textarea textarea-bordered textarea-md w-full placeholder:text-gray-500 ${props.contentHasError ? "border-red-400 textarea-error" : ""}}`}
            onChange={(e) => props.setFeedbackContent(e.target.value)}
            rows={4}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="Title"
              placeholder={`My opinion about ${props.publicProjectInfo?.name || "this project"}`}
              onChange={props.setFeedbackTitle}
              optional
              maxLength={50}
            />
            <Input
              name="Author"
              placeholder={"My Name"}
              onChange={props.setFeedbackAuthor}
              optional
              maxLength={35}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn" type="button" onClick={props.onSubmitFeedback}>submit feedback</button>
        </div>
      </form>
    </div >

  )
}

const GetFeedbackTitle: React.FC<{
  publicProjectInfo: PublicProjectInfoType;
}> = (props) => {
  return (
    <div
      className="grid"
      style={{
        color: props.publicProjectInfo?.textColor || "",
      }}
    >
      <div>
        {
          props.publicProjectInfo?.message &&
          <p className="italic max-h-40 overflow-auto">{props.publicProjectInfo.message}</p>
        }
        <h1 className="text-4xl font-bold">{props.publicProjectInfo?.name || "my project"}</h1>
        {
          props.publicProjectInfo?.description &&
          <p className="italic max-h-40 overflow-auto">{props.publicProjectInfo.description}</p>
        }
      </div>
    </div>
  );
}


const FeedbackCompletedPage: React.FC<{
  publicProjectInfo: PublicProjectInfoType;
}> = (props) => {
  return (
    <div className="flex h-screen justify-center items-center flex-col gap-10">
      <h1 className="text-2xl"><span
        className={
          `${props.publicProjectInfo?.textColor || props.publicProjectInfo?.backgroundColor ? '' : 'text-primary'} font-semibold`
        }>
        <span style={{
          color: props.publicProjectInfo?.textColor || undefined
        }}>Thank you </span></span>for the feedback!</h1>
      <div className="text-center">
        <h3>powered by</h3>
        <UTellMeComponentButton hasText />
      </div>
    </div>
  )
}

export default NewFeedbackPage;
