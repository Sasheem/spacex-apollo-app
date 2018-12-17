const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore } = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// creates a database
const store = createStore();

const server = new ApolloServer({
    context: async ({ req }) => {
        // simple auth check on every request
        const auth = (req.headers && req.headers.authorization) || '';
        const email = new Buffer(auth, 'base64').toString('ascii');

        // if email isn't formatted correctly, return null
        if (!isEmail.validate(email)) return { user: null };

        // find a user by email
        const users = await store.users.findOrCreate({ where: { email } });
        const user = users && users[0] ? users[0] : null;

        return { user: { ...user.dataValues } };
        // DO NOT USE the specific code above in production, not secure
        // the concepts are transferable to auth in real world applications tho
    },  
    typeDefs,
    resolvers,
    // connect to graph
    dataSources: () => ({
        launchAPI: new LaunchAPI(),
        userAPI: new UserAPI({ store }),
    }) 
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});