import { User } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  userId: User['id'];
  authorId: User['id'];
}

export const unsubscribeFrom: GraphQLFieldConfig<void, Context, Args> = {
  type: UUIDType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: async (_source, { userId, authorId }, ctx) => {
    const result = await ctx.prisma.subscribersOnAuthors.delete({
      where: {
        subscriberId_authorId: {
          subscriberId: userId,
          authorId,
        },
      },
    });
    return result.authorId;
  },
};