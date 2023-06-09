import { createTRPCRouter } from "~/server/api/trpc";
import { feedbacksRouter } from "./routers/feedbacks";
import { projectsRouter} from "./routers/projects";
import { userRouter } from "./routers/user";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  feedbacks: feedbacksRouter,
  projects: projectsRouter,
  user: userRouter,
  stripe: stripeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
