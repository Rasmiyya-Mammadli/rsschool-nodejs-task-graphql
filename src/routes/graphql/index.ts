import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { buildSchema } from 'graphql';
import { graphql, GraphQLResolveInfo } from 'graphql';
import { UUIDType } from './types/uuid.js';

// Sample data (you can replace this with your database or data source)
const usersData: User[] = [];

interface User {
  id: string;
  name: string;
  email: string;
}

const resolvers = {
  Query: {
    hello: () => 'Hello, GraphQL!',
  },
  Mutation: {
    createUser: (args: { name: string; email: string }) => {
      // For simplicity, generate a random UUID for the user ID (you can use a UUID library in your project)
      const userId = 'SAMPLE_USER_ID'; // Replace this with a UUID library call
      const newUser: User = {
        id: userId,
        name: args.name,
        email: args.email,
      };
      usersData.push(newUser);
      return newUser;
    },
  },
};

// Your custom GraphQL schema
const gqlSchema = `
  type Query {
    hello: String
  }

  type Mutation {
    createUser(name: String!, email: String!): User
  }

  type User {
    id: UUID!
    name: String!
    email: String!
  }
`;

const schema = buildSchema(gqlSchema);

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
      const { query, variables } = req.body;
      const result = await graphql(
        schema,
        query,
        resolvers,
        undefined,
        variables,
        undefined,
        undefined,
        (info: GraphQLResolveInfo) => {
       
        }
      );
      return { ...result };
    },
  });
};

export default plugin;
