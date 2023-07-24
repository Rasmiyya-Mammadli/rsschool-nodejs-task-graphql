import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { PostType } from '../types/post.js';

export const posts: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(PostType)),
  resolve: (_source, _args, ctx) => ctx.prisma.post.findMany(),
};