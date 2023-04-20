import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod"

export const userRouter = createTRPCRouter({

  updateName: protectedProcedure.input(z.object({
    newName: z.string().min(3).max(35),
  })).mutation(async ({ input, ctx }) => {
    return await ctx.prisma.user.update({
      where: {
        id: ctx.session.user.id,
      },
      data: {
        name: input.newName,
      }
    })
  }),

});

