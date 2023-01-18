import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const postRouter = createTRPCRouter({
  setPost: publicProcedure
    .input(z.object({ title: z.string(), content: z.string() }))
    .query(({ input }) => {
      return {
        title: `Title: ${input.title}`,
        content: `Content: ${input.content}`,
      };
    }),
  add: publicProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        // user_id: z.string().uuid(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          user: {
            connect: {
              id: ctx.session?.user.id as string,
              // id: input.user_id as string,
            },
          },
        },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.post.findMany();
  }),
});
