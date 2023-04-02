import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import LoadingIndicator from "~/components/LoadingIndicator";
import { SelectRatingComponent, StaticRatingComponent } from "~/components/RatingComponent";
import { api } from "~/utils/api";

const NewFeedbackPage: NextPage = () => {
  const router = useRouter();
  const projectId = Array.isArray(router.query.projectId) ? router.query.projectId[0] : router.query.projectId;

  const { data: project, isLoading: isProjectLoading } = api.projects.getOne.useQuery({ projectId: projectId! }, {
    enabled: !!projectId,
  });

  return (
    <>
      <Head>
        <title>{project?.name || "Tell Me!"}</title>
        <meta name="description" content={`Give feedback to ${project?.name || "my prject"}`} />
      </Head>
      <main>
        {
          isProjectLoading ?
            <div className="flex items-center justify-center h-screen">
              <LoadingIndicator />
            </div> :
            <div className="bg-base-200 lg:w-3/5 m-auto my-4 p-4 rounded-xl">
              <div className="grid grid-cols-2">
                <div>
                  <h3 className="text-xl">Tell me your opinions about</h3>
                  <h1 className="text-4xl font-bold">{project?.name || "my project"}</h1>
                </div>
                <SelectRatingComponent rating={0} onRatingChange={() => {}}/>
              </div>
              <div className="divider mt-2 mb-2" />
              <form>
                <div className="form-control gap-4">
                  <textarea placeholder="Feedback" className="textarea textarea-bordered textarea-md w-full placeholder:text-gray-500" ></textarea>
                  <div className="grid gap-4 grid-cols-2">
                    <FeedbackInput name="Title" placeholder={`my opinion about ${project?.name}`} />
                    <FeedbackInput name="Author" placeholder={"my name"} />
                  </div>
                </div>
              </form>
            </div>
        }
      </main>
    </>
  )
}

const FeedbackInput: React.FC<{
  name: string;
  placeholder: string;
  optional?: boolean;
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
        />
      </label>
    </div>
  )
}

export default NewFeedbackPage;
