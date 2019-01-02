import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { HttpLink } from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from "graphql-tag";
import { ApolloProvider } from 'react-apollo';

import Pages from './pages';
import Login from './pages/login';


const cache = new InMemoryCache();
const client = new ApolloClient({
  cache,
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      authorization: localStorage.getItem('token'),
    },
  }),
  initializers: {
    isLoggedIn: () => !!localStorage.getItem('token'),
    cartItems: () => [],
  },
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <p>Hello world from apollo</p>
    <Login />
  </ApolloProvider>, document.getElementById('root'));
