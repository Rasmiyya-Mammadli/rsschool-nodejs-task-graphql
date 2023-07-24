import { Post } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: Post['id'];
}

export const post: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, ctx) => ctx.prisma.post.findUnique({ where: { id } }),
};