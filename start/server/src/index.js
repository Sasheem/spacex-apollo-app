const { ApolloServer } = require('apollo-server');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// creates a database
const store = createStore();

const server = new ApolloServer({ 
    typeDefs,
    resolvers,
    // connect to graph
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        sserAPI: new UserAPI({ store }),
    }) 
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});