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
  id: Post['id'];
  dto: Partial<Omit<Post, 'id'>>;
}

const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
    authorId: { type: UUIDType },
  }),
});

export const changePost: GraphQLFieldConfig<void, Context, Args> = {
  type: PostType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangePostInputType) },
  },
  resolve: (_source, { id, dto }, ctx) =>
    ctx.prisma.post.update({ where: { id }, data: dto }),
};