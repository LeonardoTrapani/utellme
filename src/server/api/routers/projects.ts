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
      include: {
        feedbacks: {
          orderBy: {
            createdAt: "desc"
          },
          take: 3
        }
      },
      orderBy: {
        lastChildUpdatedAt: "desc",
      }
    }))
  }),

  getPublicInfo: publicProcedure.input(z.object({
    projectId: z.string()
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.project.findFirst({
      where: {
        id: input.projectId,
      },
      select: {
        name: true,
        description: true,
        id: true,
      }
    })
  }),

  create: protectedProcedure.input(z.object({
    name: z.string().min(1).max(75),
    description: z.string().min(1).nullish(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.create({
      data: {
        userId: ctx.session.user.id,
        name: input.name,
        description: input.description,
      }
    })
  }),

  edit: protectedProcedure.input(z.object({
    newName: z.string().min(1).max(75).nullish(),
    newDescription: z.string().nullish(),
    projectId: z.string(),
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.updateMany({
      data: {
        name: input.newName || undefined,
        description: input.newDescription,
      },
      where: {
        id: input.projectId,
        userId: ctx.session.user.id
      }
    })
  }),

  delete: protectedProcedure.input(z.object({ projectId: z.string() })).mutation(async ({ ctx, input }) => {
    await ctx.prisma.project.deleteMany({
      where: {
        id: input.projectId,
        userId: ctx.session.user.id
      }
    })
  }),

  getInfo: protectedProcedure.input(z.object({
    projectId: z.string()
  })).query(async ({ ctx, input }) => {
    return await ctx.prisma.project.findFirst({
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
      }
    });
  })
});
