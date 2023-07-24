import { GraphQLObjectType } from 'graphql';
import { changePost } from './mutations/change-post.js';
import { changeProfile } from './mutations/change-profile.js';
import { changeUser } from './mutations/change-user.js';
import { createPost } from './mutations/create-post.js';
import { createProfile } from './mutations/create-profile.js';
import { createUser } from './mutations/create-user.js';
import { deletePost } from './mutations/delete-post.js';
import { deleteProfile } from './mutations/delete-profile.js';
import { deleteUser } from './mutations/delete-user.js';
import { subscribeTo } from './mutations/subscribe-to.js';
import { unsubscribeFrom } from './mutations/unsubscribe-from.js';

export const MutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    createUser,
    createProfile,
    createPost,
    changeUser,
    changeProfile,
    changePost,
    deleteUser,
    deleteProfile,
    deletePost,
    subscribeTo,
    unsubscribeFrom,
  }),
});