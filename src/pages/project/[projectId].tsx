import React from "react";
import { type NextPage } from "next";
import { useRouter } from "next/router";
import ProjectsAndFeedbacksPageContent from "~/components/ProjectsAndFeedbacksPageContent";

const ProjectPage: NextPage = () => {
  const router = useRouter()
  return (
    <ProjectsAndFeedbacksPageContent initialProjectId={router.query.projectId} />
  )
}

export default ProjectPage
