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
  dto: Omit<Profile, 'id'>;
}

const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdType) },
  }),
});

export const createProfile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: { dto: { type: new GraphQLNonNull(CreateProfileInputType) } },
  resolve: (_source, { dto }, ctx) => ctx.prisma.profile.create({ data: dto }),
};