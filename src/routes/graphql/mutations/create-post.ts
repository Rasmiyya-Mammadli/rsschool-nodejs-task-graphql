import { Post } from '@prisma/client';
import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import { Context } from '../context.js';
import { PostType } from '../types/post.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  dto: Omit<Post, 'id'>;
}

const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const createPost: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: { dto: { type: new GraphQLNonNull(CreatePostInputType) } },
  resolve: (_source, { dto }, ctx) => ctx.prisma.post.create({ data: dto }),
};