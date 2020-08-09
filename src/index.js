const { GraphQLServer } = require('graphql-yoga')

const typeDefs = './src/schema.graphql'

let links = [
  {
    id: 'link-0',
    url: 'www.howtographql.com',
    description: 'Fullstack tutorial for GraphQL',
  },
]

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: () => links,
    link: (_, args) => links.filter(link => args.id === link.id).pop(),
  },
  Mutation: {
    post: (_, args) => {
      const link = {
        id: `link-${links.length}`,
        description: args.description,
        url: args.url,
      }
      links.push(link)
      return link
    },
    updateLink: (_, args) => {
      links = links.filter(link =>
        args.id === link.id
          ? {
            id: args.id,
            description: args.description || link.description,
            url: args.url || link.url,
          }
          : link
      )
      return link
    },
    deleteLink: (_, args) => {
      links = links.filter(link => !(link.id === args.id))
      return {
        action: 'DELETE',
        message: `Deleted link id: ${args.id}`,
      }
    },
    deleteAllFeeds: () => {
      links = []
      return {
        action: 'DELETE',
        message: 'Cleared all Feeds',
      }
    },
  },
  Link: {
    id: parent => parent.id,
    description: parent => parent.description,
    url: parent => parent.url,
  },
  ActionResponse: {
    action: parent => parent.action,
    message: parent => parent.message,
  },
}

const server = new GraphQLServer({
  typeDefs,
  resolvers,
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
