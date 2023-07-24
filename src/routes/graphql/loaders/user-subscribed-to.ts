import { User } from '@prisma/client';
import DataLoader from 'dataloader';
import { Context } from '../context.js';

export const createUserSubscribedToLoader = (ctx: Context) =>
  new DataLoader(async (ids: readonly string[]) => {
    const authors = await ctx.prisma.user.findMany({
      where: {
        subscribedToUser: {
          some: {
            subscriberId: { in: [...ids] },
          },
        },
      },
      include: {
        subscribedToUser: true,
      },
    });
    const groupedAuthors = authors.reduce(
      (acc, author) => {
        author.subscribedToUser.forEach(({ subscriberId }) => {
          if (!acc[subscriberId]) acc[subscriberId] = [];
          acc[subscriberId].push(author);
        });
        return acc;
      },
      {} as Record<string, User[]>,
    );
    return ids.map((id) => groupedAuthors[id]);
  });