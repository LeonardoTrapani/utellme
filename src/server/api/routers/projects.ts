import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const projectsRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.project.findMany(({
      where: {
        userId: ctx.session.user.id,
      },
      include: {
        feedbacks: true,
      }
    }))
  }),

  create: protectedProcedure.input(z.object({
    userId: z.string(),
    name: z.string()
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.create({
      data: {
        userId: input.userId,
        name: input.name,
      }
    })
  }),

  edit: protectedProcedure.input(z.object({ newName: z.string().nullish(), projectId: z.string(), })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.project.updateMany({
      data: {
        name: input.newName || undefined,

        // check user
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
  })
});
