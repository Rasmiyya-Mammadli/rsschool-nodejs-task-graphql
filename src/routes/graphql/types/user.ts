import { Post, User } from '@prisma/client';
import DataLoader from 'dataloader';
import {
  GraphQLFieldResolver,
  GraphQLFloat,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { Context } from '../context.js';
import { createSubscribedToUserLoader } from '../loaders/subscribed-to-user.js';
import { createUserSubscribedToLoader } from '../loaders/user-subscribed-to.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

// ----------------------------------------------------------------
export const UserType = new GraphQLObjectType<User, Context>({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: { type: ProfileType, resolve: resolveProfile },
    posts: { type: new GraphQLList(PostType), resolve: resolvePosts },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: resolveUserSubscribedTo,
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: resolveSubscribedToUser,
    },
  }),
});

// ----------------------------------------------------------------
// Resolvers
// ----------------------------------------------------------------
const resolveProfile: GraphQLFieldResolver<User, Context> = (source, _args, ctx) => {
  let loader = ctx.loaders.get('profile');
  if (!loader) {
    loader = new DataLoader(async (ids: readonly string[]) => {
      const profiles = await ctx.prisma.profile.findMany({
        where: { userId: { in: [...ids] } },
      });
      return ids.map((id) => profiles.find((profile) => profile.userId === id));
    });
    ctx.loaders.set('profile', loader);
  }
  return loader.load(source.id);
};

// ----------------------------------------------------------------
const resolvePosts: GraphQLFieldResolver<User, Context> = (source, _args, ctx) => {
  let loader = ctx.loaders.get('posts');
  if (!loader) {
    loader = new DataLoader(async (ids: readonly string[]) => {
      const posts = await ctx.prisma.post.findMany({
        where: { authorId: { in: [...ids] } },
      });
      const groupedPosts = posts.reduce(
        (acc, post) => {
          if (!acc[post.authorId]) acc[post.authorId] = [];
          acc[post.authorId].push(post);
          return acc;
        },
        {} as Record<string, Post[]>,
      );
      return ids.map((id) => groupedPosts[id]);
    });
    ctx.loaders.set('posts', loader);
  }
  return loader.load(source.id);
};

// ----------------------------------------------------------------
const resolveUserSubscribedTo: GraphQLFieldResolver<User, Context> = async (
  source,
  _args,
  ctx,
) => {
  let loader = ctx.loaders.get('userSubscribedTo');
  if (!loader) {
    loader = createUserSubscribedToLoader(ctx);
    ctx.loaders.set('userSubscribedTo', loader);
  }
  return loader.load(source.id);
};

// ----------------------------------------------------------------
const resolveSubscribedToUser: GraphQLFieldResolver<User, Context> = async (
  source,
  _args,
  ctx,
) => {
  let loader = ctx.loaders.get('subscribedToUser');
  if (!loader) {
    loader = createSubscribedToUserLoader(ctx);
    ctx.loaders.set('subscribedToUser', loader);
  }
  return loader.load(source.id);
};