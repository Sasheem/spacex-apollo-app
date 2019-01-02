import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { HttpLink } from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  })
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
