import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const feedbackRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.feedback.findMany(({
      where:{
        topic: {
          userId: ctx.session.user.id
        }
      }
    }))
  }),
});

