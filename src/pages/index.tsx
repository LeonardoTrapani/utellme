import type { NextPage } from "next";
import Head from "next/head";
import ProjectsAndFeedbacksPageContent from "~/components/ProjectsAndFeedbacksPageContent";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tell Me</title>
        <meta name="description" content="a web app to get feedback" />
        <link rel='icon' href="/favicon.ico" />
      </Head>
      <ProjectsAndFeedbacksPageContent />
    </>
  );
};

export default Home;

