import { Profile } from '@prisma/client';
import { GraphQLFieldConfig, GraphQLNonNull } from 'graphql';
import { Context } from '../context.js';
import { UUIDType } from '../types/uuid.js';

interface Args {
  id: Profile['id'];
}

export const deleteProfile: GraphQLFieldConfig<void, Context, Args> = {
  type: new GraphQLNonNull(UUIDType),
  args: { id: { type: new GraphQLNonNull(UUIDType) } },
  resolve: async (_source, { id }, ctx) => {
    const profile = await ctx.prisma.profile.delete({ where: { id } });
    return profile.id;
  },
};