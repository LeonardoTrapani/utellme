import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import Input from "~/components/Input";
import LoadingIndicator from "~/components/LoadingIndicator";
import NotFoundPage from "~/components/NotFoundPage";
import { SelectRatingComponent, } from "~/components/RatingComponent";
import { UTellMeComponentButton } from "~/components/UTellMeComponent";
import { api } from "~/utils/api";
import { toastTrpcError } from "~/utils/functions";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from "~/server/api/root";
import superjson from 'superjson';
import { prisma } from "~/server/db";
import { stripe } from "~/server/stripe/client";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ projectId: string }>,
) {
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma: prisma,
      session: null,
      res: null,
      req: null,
      stripe: stripe
    },
    transformer: superjson, // optional - adds superjson serialization
  });
  const projectId = context.params?.projectId;
  // check if post exists - `prefetch` doesn't change its behavior
  // based on the result of the query (including throws), so if we
  // want to change the logic here in gSSP, we need to use `fetch`.
  const projectPublicInfo = await helpers.projects.getPublicInfo.fetch({ projectId: projectId ?? "-1" })

  return {
    props: {
      trpcState: helpers.dehydrate(),
      notFound: !projectPublicInfo,
      projectId: projectId ?? "-1"
    },
  };
}

const NewFeedbackPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [hasGivenFeedback, setHasGivenFeedback] = React.useState(false);

  const [rating, setRating] = React.useState<number | undefined>(undefined);
  const [feedbackContent, setFeedbackContent] = React.useState<string | undefined>(undefined);
  const [feedbackTitle, setFeedbackTitle] = React.useState<string | undefined>(undefined);
  const [feedbackAuthor, setFeedbackAuthor] = React.useState<string | undefined>(undefined);

  const [contentHasError, setContentHasError] = React.useState(false);
  const [ratingHasError, setRatingHasError] = React.useState(false);

  const { data: project, isLoading: isProjectLoading } =
    api.projects.getPublicInfo.useQuery({
      projectId: props.projectId
    }, {
      enabled: !!props.projectId,
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

  const ratingRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLTextAreaElement>(null);
  const submitFeedbackHandler = () => {
    if (!project) return;
    if (!rating) {
      ratingRef?.current?.scrollIntoView({ behavior: "smooth" });
      setRatingHasError(true);
    }
    if (!feedbackContent) {
      contentRef?.current?.scrollIntoView({ behavior: "smooth" });
      setContentHasError(true);
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

  const projectDoesNotExist = props.notFound;
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
    if (project?.textColor) {
      htmlElement.style.color = project.textColor;
    }
  }, [project])
  useEffect(() => {
    return () => {
      if (!document) return;
      const htmlElement = document.getElementsByTagName("html")[0] as HTMLElement;
      htmlElement.style.backgroundColor = "";
      htmlElement.style.color = "";
    }
  }, [])

  const projectDescription = useMemo(() => (
    !project
      ?
      'project not found'
      : (
        project.message
          ?
          `${project.message} ${project.name}`
          :
          `Tell me your opinion about ${project.name}`
      )
  ), [project]);

  return (
    <>
      <Head>
        <title>{project?.name || "UTellMe"}</title>
        <meta name="description" content={projectDescription} />
      </Head>
      <main
        className="min-h-screen"
      >
        {
          isProjectLoading || isCreateFeedbackLoading ?
            <div className="flex items-center justify-center h-screen">
              <LoadingIndicator color={project?.primaryColor || undefined} />
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
                    ratingRef={ratingRef}
                    contentRef={contentRef}
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
  primaryColor: string | null;
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
  ratingRef: React.RefObject<HTMLDivElement>;
  contentRef: React.RefObject<HTMLTextAreaElement>;
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
      setTextAreaPlaceHolder(`I was indifferent about ${projectName} because...`);
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
      <div ref={props.ratingRef} className={`h-10 items-center w-min m-auto rounded-xl mb-2 ${props.ratingHasError ? "border-error border-2" : ""}`}>
        <SelectRatingComponent
          ratingColor={props.publicProjectInfo?.primaryColor || undefined}
          rating={props.currentRating}
          onRatingChange={(rating) => {
            props.setRating(rating);
          }}
        />
      </div>
      <form>
        <div className="form-control gap-4">
          <textarea
            placeholder={textAreaPlaceHolder}
            ref={props.contentRef}
            className={`mt-2 textarea textarea-bordered textarea-md w-full placeholder:text-zinc-500 ${props.contentHasError ? "border-error border-2 textarea-error" : ""}}`}
            onChange={(e) => props.setFeedbackContent(e.target.value)}
            rows={4}
            style={{
              backgroundColor: props.publicProjectInfo?.backgroundColor || undefined,
            }}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              name="Title"
              placeholder={`My opinion about ${props.publicProjectInfo?.name || "this project"}`}
              onChange={props.setFeedbackTitle}
              optional
              internalColor={props.publicProjectInfo?.backgroundColor}
              maxLength={50}
            />
            <Input
              name="Author"
              placeholder={"My Name"}
              onChange={props.setFeedbackAuthor}
              optional
              internalColor={props.publicProjectInfo?.backgroundColor}
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
    >
      <div>
        {
          props.publicProjectInfo?.message &&
          <p className="italic max-h-40 overflow-auto leading-5">{props.publicProjectInfo.message}</p>
        }
        <h1
          className="text-4xl font-bold"
          style={{
            color: props.publicProjectInfo?.primaryColor || "",
          }}
        >{props.publicProjectInfo?.name || "my project"}</h1>
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
        className={`font-semibold`}>
        <span className="text-primary" style={{
          color: props.publicProjectInfo?.primaryColor || undefined
        }}>Thank you </span></span>for the feedback!</h1>
      <div className="text-center">
        <h3>powered by</h3>
        <UTellMeComponentButton hasText />
      </div>
    </div>
  )
}

export default NewFeedbackPage;
