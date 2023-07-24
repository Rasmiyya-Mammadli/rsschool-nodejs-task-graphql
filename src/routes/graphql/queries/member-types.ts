import { GraphQLFieldConfig, GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { MemberTypeType } from '../types/member-type.js';

export const memberTypes: GraphQLFieldConfig<void, Context, void> = {
  type: new GraphQLNonNull(new GraphQLList(MemberTypeType)),
  resolve: (_source, _args, ctx) => ctx.prisma.memberType.findMany(),
};