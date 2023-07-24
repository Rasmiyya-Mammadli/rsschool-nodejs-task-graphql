import {
    GraphQLFieldConfig,
    GraphQLList,
    GraphQLNonNull,
    Kind,
    SelectionNode,
  } from 'graphql';
  import { Context } from '../context.js';
  import { createSubscribedToUserLoader } from '../loaders/subscribed-to-user.js';
  import { createUserSubscribedToLoader } from '../loaders/user-subscribed-to.js';
  import { UserType } from '../types/user.js';
  
  export const users: GraphQLFieldConfig<void, Context, void> = {
    type: new GraphQLNonNull(new GraphQLList(UserType)),
    resolve: async (_source, _args, ctx, info) => {
      const queryNodes = parseNodes(info.fieldNodes);
      const hasUserSubscribedTo = Boolean(queryNodes.users?.userSubscribedTo);
      const hasSubscribedToUser = Boolean(queryNodes.users?.subscribedToUser);
  
      const users = await ctx.prisma.user.findMany({
        include: {
          userSubscribedTo: hasUserSubscribedTo,
          subscribedToUser: hasSubscribedToUser,
        },
      });
  
      if (hasUserSubscribedTo) {
        let loader = ctx.loaders.get('userSubscribedTo');
        if (!loader) {
          loader = createUserSubscribedToLoader(ctx);
          ctx.loaders.set('userSubscribedTo', loader);
        }
        users.forEach((user) => loader?.prime(user.id, user.userSubscribedTo));
      }
  
      if (hasSubscribedToUser) {
        let loader = ctx.loaders.get('subscribedToUser');
        if (!loader) {
          loader = createSubscribedToUserLoader(ctx);
          ctx.loaders.set('subscribedToUser', loader);
        }
        users.forEach((user) => loader?.prime(user.id, user.subscribedToUser));
      }
  
      return users;
    },
  };
  
  // ----------------------------------------------------------------
  interface ParsedNodes {
    [key: string]: ParsedNodes | undefined;
  }
  
  const parseNodes = (nodes: readonly SelectionNode[]) => {
    const result: ParsedNodes = {};
    nodes.forEach((node) => {
      if (node.kind === Kind.FIELD) {
        result[node.name.value] = node.selectionSet
          ? parseNodes(node.selectionSet.selections)
          : {};
      }
    });
    return result;
  };