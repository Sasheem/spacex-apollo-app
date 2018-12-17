const { paginateResults } = require('./utils');

// This seems complex, thought I was encouraged to keep these simple? may extract elsewhere
{
    Query: {
        
    }
}
// {
//   Query: {
//     launches: async (_, { pageSize = 20, after }, { dataSources }) => {
//       const allLaunches = await dataSources.launchAPI.getAllLaunches();
//       // we want these in reverse chronological order
//       allLaunches.reverse();

//       const launches = paginateResults({
//         after,
//         pageSize,
//         results: allLaunches,
//       });

//       return {
//         launches,
//         cursor: launches.length ? launches[launches.length - 1].cursor : null,
//         // if the cursor of the end of the paginated results is the same as the
//         // last item in _all_ results, then there are no more results after this
//         hasMore: launches.length
//           ? launches[launches.length - 1].cursor !==
//             allLaunches[allLaunches.length - 1].cursor
//           : false,
//       };
//     }
//   }
// };

module.exports = {
    Query: {
        // launches: async (_, __, { dataSources }) => dataSources.launchAPI.getAllLaunches(),
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            allLaunches.reverse();

            const launches = paginateResults({
                after,
                pageSize,
                results: allLaunches,
            });

            return {
                launches,
                cursor: launches.length ? launches[launches.length - 1].cursor : null,
                // if the cursor of the end of the paginated results is the same as the
                // last item in _all_ results, then there are no more results after this
                hasMore: launches.length
                    ? launches[launches.length - 1].cursor !== allLaunches[allLaunches.length - 1].cursor
                    : false,
            };
        },
        launch: (_, { id }, { dataSources }) => dataSources.launchAPI.getLaunchById({ launchId: id }),
        me: async (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser(),
    },
    // can write resolvers for types in addition to Query and Mutations
    Mission: {
        // make sure default size is 'large' in case user doesn't specify
        missionPatch: (mission, { size } = { size: 'LARGE' }) => {
            return size === 'SMALL'
                ? mission.missionPatchSmall
                : mission.missionPatchLarge;
        },
    },
    Launch: {
        isBooked: async (launch, _, { dataSources }) => 
            dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
    },
    User: {
        // why don't we pass in 'user' as our parent arg? Can i? is it optional? test it out, 
        // probably cuz we don't need to use it
        trips: async (user, __, { dataSources }) => {
            // get ids of launches by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

            if (!launchIds.length) return [];

            // look up these launches by their ids
            return (
                dataSources.launchAPI.getLaunchesByIds({
                    launchIds,
                }) || []
            );
        }
    }
};