import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod"
import { TRPCError } from "@trpc/server";

export const feedbacksRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.feedback.findMany(({
      where: {
        userId: ctx.session.user.id,
        topic: {
          userId: ctx.session.user.id
        }
      }
    }))
  }),

  create: protectedProcedure.input(z.object({
    title: z.string().nullish(),
    content: z.string(),
    topicId: z.string()
  })).mutation(async ({ ctx, input }) => {
    const feedbacksTopic = await ctx.prisma.topic.findFirst({where: {
      id: input.topicId,
      userId: ctx.session.user.id
    }})
    if (!feedbacksTopic) throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR', 
      message: "The selected topic isn't yours"
    })
    return await ctx.prisma.feedback.create({
      data: {
        title: input.title,
        content: input.content,
        topicId: input.topicId,
        userId: ctx.session.user.id
      },
    })
  }),

  edit: protectedProcedure.input(z.object({
    id: z.string(),
    newTitle: z.string().nullish(),
    newContent: z.string().nullish(),
    newTopicId: z.string().nullish(),
  })).mutation(async ({ ctx, input }) => {
    const feedbacksTopic = await ctx.prisma.topic.findFirst({where: {
      id: input.newTopicId || undefined,
      userId: ctx.session.user.id
    }})
    if (!feedbacksTopic) throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR', 
      message: "The selected topic isn't yours"
    })
    return await ctx.prisma.feedback.update({
      where: {
        id: input.id
      },
      data: {
        title: input.newTitle || undefined,
        content: input.newContent || undefined,
        topicId: input.newTopicId || undefined
      }
    })
  }),

  delete: protectedProcedure.input(z.object({
    id: z.string(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.feedback.deleteMany({
      where: {
        id: input.id,
        userId: ctx.session.user.id
      },
    })
  })

});

