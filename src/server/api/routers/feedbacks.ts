import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const feedbacksRouter = createTRPCRouter({

  getAll: protectedProcedure.input(z.object({
    projectId: z.string().min(1),
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.feedback.findMany(({
      where: {
        project: {
          userId: ctx.session.user.id,
          id: input.projectId
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }))
  }),

  create: publicProcedure.input(z.object({
    title: z.string().min(1).max(50).nullish(),
    content: z.string().min(1),
    projectId: z.string().min(1),
    author: z.string().min(1).max(35).nullish(),
    rating: z.number().min(1).max(5),
  })).mutation(async ({ ctx, input }) => {
    return ctx.prisma.$transaction(async (trx) => {
      await trx.feedback.create({
        data: {
          title: input.title,
          content: input.content,
          projectId: input.projectId,
          author: input.author,
          rating: input.rating,
        },
      })
      await trx.project.update({
        where: {
          id: input.projectId
        },
        data: {
          lastChildUpdatedAt: new Date()
        }
      })
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
