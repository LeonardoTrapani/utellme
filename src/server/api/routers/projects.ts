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
        primaryColor: true,
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
    newTextColor: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
    newBackgroundColor: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
    newPrimaryColor: z.string().regex(/^#[0-9a-f]{6}$/i).nullish(),
  })).mutation(async ({ ctx, input }) => {
    if (input.newMessage || input.newTextColor || input.newOrderBy || input.newPrimaryColor || input.newBackgroundColor) {
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id
        }
      });
      if (user?.stripeSubscriptionStatus !== "active") {
        throw new Error("You must have an active subscription to change these settings.");
      }
    }
    return await ctx.prisma.project.updateMany({
      data: {
        name: input.newName || undefined,
        description: input.newDescription,
        message: input.newMessage,
        orderBy: input.newOrderBy || undefined,
        textColor: input.newTextColor,
        backgroundColor: input.newBackgroundColor,
        primaryColor: input.newPrimaryColor,
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
        primaryColor: true,
        backgroundColor: true,
        message: true,
      }
    });
    return getInfoResult;
  })
});
