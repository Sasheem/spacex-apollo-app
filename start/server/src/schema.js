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
    type TripUpdateResponse {
        success: Boolean!
        message: String
        launches: [Launch]
    }
    enum PatchSize {
        SMALL
        LARGE
    }
    type Mutation {
        # if false, booking trip failed -- check errors
        bookTrips(launchIds: [ID]!): TripUpdateResponse!
        #if false, cancellation failed -- check errors
        cancelTrip(launchId: ID!): TripUpdateResponse!
        # returns login token
        login(email: String): String
    }

`;

module.exports = typeDefs;