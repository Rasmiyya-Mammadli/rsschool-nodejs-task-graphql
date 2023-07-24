import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { createContext } from './context.js';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { prisma } = fastify;
      const { query, variables } = req.body;

      const errors = validate(gqlSchema, parse(query), [depthLimit(5)]);
      if (errors.length) return { errors };

      return graphql({
        schema: gqlSchema,
        source: query,
        variableValues: variables,
        contextValue: createContext(fastify),
      });
    },
  });
};

export default plugin;