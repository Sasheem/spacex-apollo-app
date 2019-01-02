import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import Loading from '../components/loading';
import LoginForm from '../components/login-form';

const LOGIN_USER = gql`
    mutation login($email: String!) {
        login(email: $email)
    }
`;

export default function Login() {
    return (
        <ApolloConsumer>
            {client => (
                <Mutation 
                    mutation={LOGIN_USER}
                    onCompleted={({ login }) => {
                        localStorage.setItem('token', login);
                        client.writeData({ data: { isLoggedIn: true } });
                    }}
                >
                    {(login, { loading, error }) => {
                        // loading will probably never render
                        if (loading) return <Loading />;
                        if (error) return <p>ERROR: {error.message}</p>

                        return <LoginForm login={login} />;
                    }}
                </Mutation>
            )}
        </ApolloConsumer>
    );
}