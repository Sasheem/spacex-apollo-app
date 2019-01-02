import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    uri: "http://localhost:4000/graphql"
});

client
.query({
  query: gql`
    query GetLaunch {
      launch(id: 56) {
        id
        mission {
          name
        }
      }
    }
  `
})
.then(result => console.log(result));

ReactDOM.render(
  <ApolloProvider client={client}>
    <p>Hello world from apollo</p>
  </ApolloProvider>, document.getElementById('root'));
