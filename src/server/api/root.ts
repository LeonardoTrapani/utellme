import { createTRPCRouter } from "~/server/api/trpc";
import { feedbacksRouter } from "./routers/feedbacks";
import { topicsRouter} from "./routers/topics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  feedbacks: feedbacksRouter,
  topics: topicsRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
