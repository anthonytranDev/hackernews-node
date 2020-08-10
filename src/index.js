const { GraphQLServer } = require('graphql-yoga')
const { PrismaClient } = require('@prisma/client')

const typeDefs = './src/schema.graphql'

const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`,
    feed: async (parent, args, context) => {
      return context.prisma.link.findMany()
    },
    // link: (_, args) => links.filter(link => args.id === link.id).pop(),
  },
  Mutation: {
    post: (parent, args, context, info) => {
      const newLink = context.prisma.link.create({
        data: {
          url: args.url,
          description: args.description,
        },
      })
      return newLink
    },
    // updateLink: (_, args) => {
    //   links = links.filter(link =>
    //     args.id === link.id
    //       ? {
    //         id: args.id,
    //         description: args.description || link.description,
    //         url: args.url || link.url,
    //       }
    //       : link
    //   )
    //   return link
    // },
    // deleteLink: (_, args) => {
    //   links = links.filter(link => !(link.id === args.id))
    //   return {
    //     action: 'DELETE',
    //     message: `Deleted link id: ${args.id}`,
    //   }
    // },
    // deleteAllFeeds: () => {
    //   links = []
    //   return {
    //     action: 'DELETE',
    //     message: 'Cleared all Feeds',
    //   }
    // },
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

const prisma = new PrismaClient()

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: {
    prisma
  }
})

server.start(() => console.log(`Server is running on http://localhost:4000`))
