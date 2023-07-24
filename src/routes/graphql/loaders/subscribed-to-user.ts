import { User } from '@prisma/client';
import DataLoader from 'dataloader';
import { Context } from '../context.js';

export const createSubscribedToUserLoader = (ctx: Context) =>
  new DataLoader(async (ids: readonly string[]) => {
    const subscribers = await ctx.prisma.user.findMany({
      where: {
        userSubscribedTo: {
          some: {
            authorId: { in: [...ids] },
          },
        },
      },
      include: {
        userSubscribedTo: true,
      },
    });
    const groupedSubscribers = subscribers.reduce(
      (acc, subscriber) => {
        subscriber.userSubscribedTo.forEach(({ authorId }) => {
          if (!acc[authorId]) acc[authorId] = [];
          acc[authorId].push(subscriber);
        });
        return acc;
      },
      {} as Record<string, User[]>,
    );
    return ids.map((id) => groupedSubscribers[id]);
  });