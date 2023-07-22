import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { buildSchema } from 'graphql';
import { graphql, GraphQLResolveInfo } from 'graphql';
import depthLimit from 'graphql-depth-limit'; 
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
      // Generate a random UUID for the user ID using the UUIDType
      const userId = UUIDType.serialize(generateRandomUUID());
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


const generateRandomUUID = (): string => {
  // Implement your logic here to generate a random UUID.
  // For simplicity, you can use a library or a custom function to generate the UUID.
  // Replace this with your actual implementation to generate random UUIDs.
  return 'SAMPLE_RANDOM_UUID';
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
          // Step 2: Use depthLimit as a validation rule to limit query complexity
          return { validationRules: [depthLimit(5)] };
        }
      );
      return { ...result };
    },
  });
};

export default plugin;
