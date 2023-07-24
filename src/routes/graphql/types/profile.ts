import { Profile } from '@prisma/client';
import DataLoader from 'dataloader';
import {
  GraphQLBoolean,
  GraphQLFieldResolver,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';
import { Context } from '../context.js';
import { MemberTypeIdType } from './member-type-id.js';
import { MemberTypeType } from './member-type.js';
import { UUIDType } from './uuid.js';

// ----------------------------------------------------------------
export const ProfileType = new GraphQLObjectType<Profile, Context>({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdType },
    memberType: {
      type: new GraphQLNonNull(MemberTypeType),
      resolve: resolveMemberType,
    },
  }),
});

// ----------------------------------------------------------------
// Resolvers
// ----------------------------------------------------------------
const resolveMemberType: GraphQLFieldResolver<Profile, Context> = (
  source,
  _args,
  ctx,
) => {
  let loader = ctx.loaders.get('memberType');
  if (!loader) {
    loader = new DataLoader(async (ids: readonly string[]) => {
      const types = await ctx.prisma.memberType.findMany({
        where: { id: { in: [...ids] } },
      });
      return ids.map((id) => types.find((types) => types.id === id));
    });
    ctx.loaders.set('memberType', loader);
  }
  return loader.load(source.memberTypeId);
};