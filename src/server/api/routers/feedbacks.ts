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
    content: z.string(),
    projectId: z.string(),
    author: z.string().nullish(),
    rating: z.enum(["ONE", "TWO", "THREE", "FOUR", "FIVE"]),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.feedback.create({
      data: {
        title: input.title,
        content: input.content,
        projectId: input.projectId,
        author: input.author,
        rating: input.rating,
        anonymous: !input.author,
      },
    })
  }),

  /* Commented because people can post feedbacks without an account, so they can't edit them
    edit: protectedProcedure.input(z.object({
      id: z.string(),
      newTitle: z.string().nullish(),
      newContent: z.string().nullish(),
      newProjectId: z.string().nullish(),
    })).mutation(async ({ ctx, input }) => {
      const currProject = await ctx.prisma.project.findFirst({
        where: {
          id: input.newProjectId || undefined,
          userId: ctx.session.user.id
        }
      })
      if (!currProject) throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: "The selected project isn't yours"
      })
      return await ctx.prisma.feedback.update({
        where: {
          id: input.id
        },
        data: {
          title: input.newTitle || undefined,
          content: input.newContent || undefined,
          projectId: input.newProjectId || undefined
        }
      })
    }),
  */

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
