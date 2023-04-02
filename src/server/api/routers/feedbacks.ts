import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const feedbacksRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.feedback.findMany(({
      where: {
        project: {
          userId: ctx.session.user.id
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }))
  }),

  create: publicProcedure.input(z.object({
    title: z.string().nullish(),
    content: z.string().min(1),
    projectId: z.string().min(1),
    author: z.string().nullish(),
    rating: z.number().min(1).max(5),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.feedback.create({
      data: {
        title: input.title,
        content: input.content,
        projectId: input.projectId,
        author: input.author,
        rating: input.rating,
      },
    })
  }),

  delete: protectedProcedure.input(z.object({
    id: z.string(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.feedback.deleteMany({
      where: {
        id: input.id,
        project: {
          userId: ctx.session.user.id
        }
      },
    })
  })

});
