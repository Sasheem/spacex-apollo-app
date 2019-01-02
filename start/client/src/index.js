import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient, { HttpLink } from "apollo-boost";
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Query, ApolloProvider } from 'react-apollo';
import gql from "graphql-tag";

import Pages from './pages';
import Login from './pages/login';
import injectStyles from './styles';


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

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;

injectStyles();
ReactDOM.render(
  <ApolloProvider client={client}>
    <Query query={IS_LOGGED_IN}>
      {({ data }) => (data.isLoggedIn ? <Pages /> : <Login />)}
    </Query>
    {/* <Login /> */}
  </ApolloProvider>, document.getElementById('root'));
