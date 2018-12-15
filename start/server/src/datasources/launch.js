const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://api.spacexdata.com/v2/';
    }

    async getAllLaunches() {
        const res = await this.get('launches');
        // if res exists and res.lenght exists 
        // then return new array w/ launchReducer transforming response from our REST endpoint
        // else return empty array
        return res && res.length ? res.map(l => this.launchReducer(l)) : [];
    }
    // method takes in a flight number and returns the data for a particular launch
    async getLaunchById({ launchId }) {
        const res = await this.get('launches', { flight_number: launchId });
        return this.launchReducer(res[0]);
    }
    // returns several launches based on their respective launchIds
    getLaunchByIds({ launchIds }) {
        return Promise.all(
            launchIds.map(launchId => this.getLaunchById({ launchId })),
        );
    }

    // transform launch data into a shape the schema expects
    launchReducer(launch) {
        return {
            id: launch.flight_number || 0,
            cursor: `${launch.launch_date_unix}`,
            site: launch.launch_site && launch.launch_site.site_name,
            mission: {
                name: launch.mission_name,
                missionPatchSmall: launch.links.mission_patch_small,
                missionPatchLarge: launch.links.mission_patch,
            },
            rocket: {
                id: launch.rocket.rocket_id,
                name: launch.rocket.rocket_name,
                type: launch.rocket.rocket_type,
            },
        };
    }
}

module.exports = LaunchAPI;