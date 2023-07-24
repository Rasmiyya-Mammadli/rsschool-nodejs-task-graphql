import { Post } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: Post['id'];
}

export const deletePost: GraphQLFieldConfig<void, Context, Args> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, ctx) => {
    const post = await ctx.prisma.post.delete({ where: { id } });
    return post.id;
  },
};