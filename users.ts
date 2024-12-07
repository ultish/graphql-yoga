
import { parse } from 'graphql';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { createYoga } from 'graphql-yoga';
import { createServer } from 'http'; 
import { renderGraphiQL } from '@graphql-yoga/render-graphiql'
 
 
const typeDefs = parse(/* GraphQL */ `
  type Query {
    me: User
  }
 
  type User @key(fields: "id") {
    id: ID!
    username: String
  }
`)
 
const resolvers = {
  Query: {
    me() {
      return { id: '1', username: '@ava' }
    }
  },
  User: {
    __resolveReference(user: any, { fetchUserById }: any) {
      return fetchUserById(user.id)
    }
  }
} 
const yoga = createYoga({
    renderGraphiQL,
    schema: buildSubgraphSchema([{ typeDefs, resolvers }])
})
 
const server = createServer(yoga)
 
server.listen(4001, () => {
  console.log(`🚀 Server ready at http://localhost:4001`)
})