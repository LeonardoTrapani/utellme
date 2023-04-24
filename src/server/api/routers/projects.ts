import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const projectsRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany(({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        lastChildUpdatedAt: "desc",
      }
    }));
  }),

  getPublicInfo: publicProcedure.input(z.object({
    projectId: z.string().trim().min(1)
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.project.findFirst({
      where: {
        id: input.projectId,
      },
      select: {
        name: true,
        description: true,
        id: true,
        textColor: true,
        backgroundColor: true,
        message: true,
      }
    })
  }),

  create: protectedProcedure.input(z.object({
    name: z.string().trim().min(1).max(75),
    description: z.string().trim().min(1).nullish(),
    message: z.string().trim().min(1).nullish(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.create({
      data: {
        userId: ctx.session.user.id,
        name: input.name,
        description: input.description,
        message: input.message,
      }
    })
  }),

  edit: protectedProcedure.input(z.object({
    newName: z.string().trim().min(1).max(75).nullish(),
    newDescription: z.string().trim().nullish(),
    newMessage: z.string().trim().max(75).nullish(),
    newOrderBy: z.enum([
      "createdAtDesc",
      "createdAtAsc",
      "ratingDesc",
      "ratingAsc"
    ]).nullish(),
    projectId: z.string().trim().min(1),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.updateMany({
      data: {
        name: input.newName || undefined,
        description: input.newDescription,
        message: input.newMessage,
        orderBy: input.newOrderBy || undefined,
      },
      where: {
        id: input.projectId,
        userId: ctx.session.user.id
      }
    })
  }),

  delete: protectedProcedure.input(z.object({ projectId: z.string().trim().min(1) })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.project.deleteMany({
      where: {
        id: input.projectId,
        userId: ctx.session.user.id
      }
    })
  }),

  getInfo: protectedProcedure.input(z.object({
    projectId: z.string().min(1)
  })).query(async ({ ctx, input }) => {
    const getInfoResult = await ctx.prisma.project.findFirst({
      where: {
        id: input.projectId,
        userId: ctx.session.user.id
      },
      select: {
        _count: true,
        id: true,
        name: true,
        description: true,
        createdAt: true,
        averageRating: true,
        textColor: true,
        backgroundColor: true,
        message: true,
      }
    });
    return getInfoResult;
  })
});
