import { User } from '@prisma/client';
import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context.js';
import { UserType } from '../types/user.js';

interface Args {
  dto: Omit<User, 'id'>;
}

const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const createUser: GraphQLFieldConfig<void, Context, Args> = {
  type: UserType as GraphQLObjectType,
  args: { dto: { type: new GraphQLNonNull(CreateUserInputType) } },
  resolve: (_source, { dto }, ctx) => ctx.prisma.user.create({ data: dto }),
};