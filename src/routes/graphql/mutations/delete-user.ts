import { User } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: User['id'];
}

export const deleteUser: GraphQLFieldConfig<void, Context, Args> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, ctx) => {
    const user = await ctx.prisma.user.delete({ where: { id } });
    return user.id;
  },
};