import { Profile } from '@prisma/client';
import {
  GraphQLBoolean,
  GraphQLFieldConfig,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
} from 'graphql';
import { Context } from '../context.js';
import { MemberTypeIdType } from '../types/member-type-id.js';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: Profile['id'];
  dto: Partial<Omit<Profile, 'id' | 'userId'>>;
}

const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdType },
  }),
});

export const changeProfile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: {
    id: { type: new GraphQLNonNull(UUIDType) },
    dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
  },
  resolve: (_source, { id, dto }, ctx) =>
    ctx.prisma.profile.update({ where: { id }, data: dto }),
};