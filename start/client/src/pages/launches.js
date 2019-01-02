import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import LaunchTile from '../components/launch-tile';
import Header from '../components/header';
import Button from '../components/button';
import Loading from '../components/loading';

const GET_LAUNCHES = gql`
    query launchList($after: String) {
        launches(after: $after) {
            cursor
            hasMore
            launches {
                id
                isBooked
                rocket {
                    id
                    name
                }
                mission {
                    name
                    missionPatch
                }
            }
        }
    }
`;

// pass the above query to Apollo's Query component to render the list
export default function Launches() {
    return (
        <Query query={GET_LAUNCHES}>
            {({ data, loading, error, fetchMore }) => {
                
                if (loading) return <Loading />;
                if (error) return <p>ERROR: {error.message}</p>

                return (
                    <Fragment>
                        <Header />
                        {data.launches && data.launches.launches && data.launches.launches.map(launch => (
                            <LaunchTile 
                                key={launch.id}
                                launch={launch}
                            />
                        ))}
                        {/* check to see if launches exists and we have more launches available in our query */}
                        {data.launches &&
                            data.launches.hasMore && (
                                // since we have more launches, render a Button component w/ a click handler that
                                // calls fetchMore function from Apollo
                                <Button
                                    onClick={() => 
                                        fetchMore({
                                            variables: {
                                                after: data.launches.cursor,
                                            },
                                            /* 
                                            to tell Apollo how to update the list of launches in our cache 
                                                - we take the previous query result & combine it with the new 
                                                  query result from fetchMore
                                            pass arrow function to updateQuery w/ 2 args
                                                first: previous launches
                                                second: object w/ next set of launches & a new array
                                                    containing the remaining launches
                                            */
                                            updateQuery: (prev, { fetchMoreResult, ...rest }) => {
                                                if (!fetchMoreResult) return prev;
                                                // return object with new array containing result
                                                return {
                                                    ...fetchMoreResult,
                                                    launches: {
                                                        ...fetchMoreResult.launches,
                                                        launches: [
                                                            ...prev.launches.launches,
                                                            ...fetchMoreResult.launches.launches,
                                                        ],
                                                    },
                                                };
                                            },
                                        })
                                    }
                                >Load More</Button>
                            )
                        }
                    </Fragment>
                );
            }}
        </Query>
    );
};