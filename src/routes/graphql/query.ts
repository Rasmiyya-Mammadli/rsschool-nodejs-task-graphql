import { GraphQLObjectType } from 'graphql';
import { memberType } from './queries/member-type.js';
import { memberTypes } from './queries/member-types.js';
import { post } from './queries/post.js';
import { posts } from './queries/posts.js';
import { profile } from './queries/profile.js';
import { profiles } from './queries/profiles.js';
import { user } from './queries/user.js';
import { users } from './queries/users.js';

export const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    memberTypes,
    memberType,
    posts,
    post,
    users,
    user,
    profiles,
    profile,
  }),
});