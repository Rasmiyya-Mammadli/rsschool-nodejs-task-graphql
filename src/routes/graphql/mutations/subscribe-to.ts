import { User } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '../context.js';
import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  userId: User['id'];
  authorId: User['id'];
}

export const subscribeTo: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType,
  args: {
    userId: { type: new GraphQLNonNull(UUIDType) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
  resolve: (_source, { userId, authorId }, ctx) => {
    return ctx.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userSubscribedTo: {
          create: {
            authorId,
          },
        },
      },
    });
  },
};