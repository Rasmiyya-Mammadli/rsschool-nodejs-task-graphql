import { User } from '@prisma/client';
import {
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context.js';
import { UserType } from '../types/user.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: User['id'];
  dto: Partial<Omit<User, 'id'>>;
}

const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLInt },
  }),
});

export const changeUser: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeUserInputType) },
  },
  resolve: (_source, { id, dto }, ctx) =>
    ctx.prisma.user.update({ where: { id }, data: dto }),
};