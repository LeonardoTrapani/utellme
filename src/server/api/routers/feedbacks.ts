import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod"
import type { Prisma, PrismaClient } from "@prisma/client";

export const feedbacksRouter = createTRPCRouter({

  getAll: protectedProcedure.input(z.object({
    projectId: z.string().trim().min(1),
  })).query(async ({ ctx, input }) => {
    const orderBy = await getFeedbackOrderBy(ctx.prisma, input.projectId)
    return await ctx.prisma.feedback.findMany(({
      where: {
        project: {
          userId: ctx.session.user.id,
          id: input.projectId
        }
      },
      orderBy,
    }))
  }),

  create: publicProcedure.input(z.object({
    title: z.string().trim().min(1).max(50).nullish(),
    content: z.string().trim().min(1),
    projectId: z.string().trim().min(1),
    author: z.string().trim().min(1).max(35).nullish(),
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
      const averageRating = await calculateAverageRating(trx, input.projectId);
      await trx.project.update({
        where: {
          id: input.projectId
        },
        data: {
          lastChildUpdatedAt: new Date(),
          averageRating
        }
      })
    })
  }),

  delete: protectedProcedure.input(z.object({
    id: z.string().trim(),
    projectId: z.string()
  })).mutation(async ({ ctx, input }) => {
    return await ctx.prisma.$transaction(async (trx) => {
      await trx.feedback.deleteMany({
        where: {
          id: input.id,
          project: {
            userId: ctx.session.user.id
          },
        },
      })
      const averageRating = await calculateAverageRating(trx, input.projectId);
      await trx.project.update({
        where: {
          id: input.projectId,
        },
        data: {
          lastChildUpdatedAt: new Date(),
          averageRating
        }
      })
    });
  })

});

const calculateAverageRating = async (
  trx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">,
  projectId: string) => {
  const avgRating = await trx.feedback.aggregate({
    where: {
      projectId: projectId,
    },
    _avg: {
      rating: true
    },
  });
  if (!avgRating._avg.rating) {
    throw new Error("Could not calculate average rating")
  }
  return avgRating._avg.rating
}

type OrderByType = {
  rating?: "asc" | "desc",
  createdAt: "asc" | "desc"
};

export const getFeedbackOrderBy = async (
  trx: Omit<PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use">,
  projectId: string
) => {
  const project = await trx.project.findUnique({
    where: {
      id: projectId,
    }
  });
  if (!project) {
    throw new Error("There was an error fetching the project");
  }
  if (project.orderBy === "ratingAsc") {
    return {
      rating: "asc",
    } as OrderByType;
  }
  if (project.orderBy === "ratingDesc") {
    return {
      rating: "desc",
    } as OrderByType;
  }
  if (project.orderBy === "createdAtAsc") {
    return {
      createdAt: "asc",
    } as OrderByType;
  }
  if (project.orderBy === "createdAtDesc") {
    return {
      createdAt: "desc",
    } as OrderByType;
  }
}
