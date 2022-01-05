// step 1 : import GraphQLServer with graphql-yoga, npm this before
const {GraphQLServer} = require('graphql-yoga')
// step 5: stock the messages
const messages = []
// step 3: define types of the keys
const typeDefs = `
type Message {
    id: ID!
    user: String!
    content: String!
}
type Query {
    messages: [Message!]
}
type Mutation {
    postMessage(user: String!, content: String!): ID!
}
`

// step 4: show the results in resolvers
const resolvers = {
    Query: {
        messages: () => messages, 
    },
    Mutation: {
        postMessage: (parent, {user, content}) => {
            const id = messages.length;
            messages.push({
                id, 
                user,
                content
            });
            return id;
        }
    }
}
//step 2: create server
const server = new GraphQLServer({
    // step 6: bring typeDefs and resolvers in here and npm run start to try graphql
    typeDefs, resolvers});
server.start(({port})=> {
    console.log(`server on http://localhost:${port}`)
}) 