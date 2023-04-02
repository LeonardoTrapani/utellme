import type { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import LoadingIndicator from "~/components/LoadingIndicator";
import { SelectRatingComponent, } from "~/components/RatingComponent";
import { api } from "~/utils/api";

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

  const { data: project, isLoading: isProjectLoading } = api.projects.getOne.useQuery({ projectId: projectId || "-1" }, {
    enabled: !!projectId,
  });

  const { mutate: createFeedbackMutation, isLoading: isCreateFeedbackLoading } = api.feedbacks.create.useMutation({
    onSuccess: () => {
      setHasGivenFeedback(true);
    },
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

    createFeedbackMutation({
      title: feedbackTitle,
      content: feedbackContent,
      rating: rating,
      author: feedbackAuthor,
      projectId: project?.id
    })
  }

  return (
    <>
      <Head>
        <title>{project?.name || "Tell Me!"}</title>
        <meta name="description" content={`Give feedback to ${project?.name || "my prject"}`} />
      </Head>
      <main>
        {
          isProjectLoading || isCreateFeedbackLoading ?
            <div className="flex items-center justify-center h-screen">
              <LoadingIndicator />
            </div> :
            (
              !hasGivenFeedback ?
                <MainGetFeedbackContent
                  projectName={project?.name}
                  setRating={(rating) =>
                    setRating(rating)}
                  onSubmitFeedback={submitFeedbackHandler}
                  setFeedbackTitle={(title) => setFeedbackTitle(title)}
                  setFeedbackAuthor={(author) => setFeedbackAuthor(author)}
                  setFeedbackContent={(content) => setFeedbackContent(content)}
                  contentHasError={contentHasError}
                  ratingHasError={ratingHasError}
                /> :
                <h1>Thanks for the feedback</h1>
            )
        }
      </main>
    </>
  )
}

const MainGetFeedbackContent: React.FC<{
  projectName?: string;
  onSubmitFeedback: () => void;
  setRating: (rating: number) => void;
  setFeedbackTitle: (title: string) => void;
  setFeedbackAuthor: (author: string) => void;
  setFeedbackContent: (content: string) => void;
  contentHasError: boolean;
  ratingHasError: boolean;
}> = (props) => {
  return (
    <div className="bg-base-200 lg:w-3/5 m-auto my-4 p-4 rounded-xl">
      <GetFeedbackTitle projectName={props.projectName} />
      <div className="divider mt-2 mb-2" />
      <div className="mb-2">
        <SelectRatingComponent
          rating={0}
          onRatingChange={(rating) => {
            props.setRating(rating);
          }}
        />
        {props.ratingHasError && <span className="text-red-500">Please select a rating</span>}
      </div>
      <form>
        <div className="form-control gap-4">
          <textarea placeholder="Feedback"
            className={`textarea textarea-bordered textarea-md w-full placeholder:text-gray-500 ${props.contentHasError ? "border-red-400 textarea-error" : ""}}`}
            onChange={(e) => props.setFeedbackContent(e.target.value)}
          />
          <div className="grid gap-4 grid-cols-2">
            <FeedbackInput name="Title" placeholder={`my opinion about ${props.projectName || "this project"}`}
              onChange={props.setFeedbackTitle}
            />
            <FeedbackInput name="Author" placeholder={"my name"}
              onChange={props.setFeedbackAuthor}
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn" type="button" onClick={props.onSubmitFeedback}>submit feedback</button>
        </div>
      </form>
    </div>

  )
}
const GetFeedbackTitle: React.FC<{
  projectName?: string;
}> = (props) => {
  return (
    <div className="grid grid-cols-2">
      <div>
        <h3 className="text-xl">Tell me your feedback about</h3>
        <h1 className="text-4xl font-bold">{props.projectName || "my project"}</h1>
      </div>
    </div>);
}


const FeedbackInput: React.FC<{
  name: string;
  placeholder: string;
  optional?: boolean;
  onChange: (value: string) => void;
}> = (props) => {
  return (
    <div>
      <label className="flex justify-end text-end text-sm italic text-gray-500 mr-2 select-none">optional</label>
      <label className="input-group">
        <span>{props.name}</span>
        <input
          type="text"
          placeholder={props.placeholder}
          className="input input-bordered placeholder:text-gray-500 w-full"
          onChange={(e) => props.onChange(e.target.value)}
        />
      </label>
    </div>
  )
}

export default NewFeedbackPage;
