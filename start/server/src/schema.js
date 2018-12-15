const { gql } = require('apollo-server');

const typeDefs = gql`
    type Query {
        #query returns an array of launches, never null b/c !
        launches: [Launch!]
        #query to fetch a launch by ID and returns a single launch
        launch(id: ID!): Launch
        #Queries for the current user
        me: User
    }
    type Launch {
        id: ID!
        site: String
        mission: Mission
        rocket: Rocket
        isBooked: Boolean!
    }
    type Rocket {
        id: ID!
        name: String
        type: String
    }
    type User {
        id: ID!
        email: String!
        trips: [Launch]!
    }
    type Mission {
        name: String
        missionPatch(size: PatchSize): String
    }
    enum PatchSize {
        SMALL
        LARGE
    }
`;

module.exports = typeDefs;