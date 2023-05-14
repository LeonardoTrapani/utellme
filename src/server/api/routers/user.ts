import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { z } from "zod"
import { stripe } from "~/server/stripe/client";

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

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.$transaction(async (trx) => {
      const user = await trx.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
      });
      if (!user) throw new Error("Could not find user");
      await trx.user.delete({
        where: {
          id: ctx.session.user.id,
        },
        include: {
          sessions: true,
          accounts: true,
        }
      });
      if (user.stripeCustomerId) {
        await stripe.customers.del(user.stripeCustomerId)
      }
      return;
    });
  }),

  subscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    const { session, prisma } = ctx;

    if (!session.user?.id) {
      throw new Error("Not authenticated");
    }

    const data = await prisma.user.findUnique({
      where: {
        id: session.user?.id,
      },
      select: {
        stripeSubscriptionStatus: true,
      },
    });

    if (!data) {
      throw new Error("Could not find user");
    }

    return data.stripeSubscriptionStatus;
  }),

});

