import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { ProfileType } from '../types/profile.js';

export const profiles: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(ProfileType)),
  resolve: (_source, _args, ctx) => ctx.prisma.profile.findMany(),
};