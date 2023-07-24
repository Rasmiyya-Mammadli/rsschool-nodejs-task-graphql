import { Profile } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { ProfileType } from '../types/profile.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: Profile['id'];
}

export const profile: GraphQLFieldConfig<void, Context, Args> = {
  type: ProfileType,
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: (_source, { id }, ctx) => ctx.prisma.profile.findUnique({ where: { id } }),
};