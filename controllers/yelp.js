const axios = require('axios');

const qs = require('querystring');

let fusionApi;
let tokenCred;

if(!process.env.CONFIG) {
	const config = require('../config/config');
	fusionApi = config.fusionApi;
	tokenCred = config.tokenCred;
} else {
	fusionApi = process.env.FUSION_API;
	tokenCred = {
		grant_type: process.env.GRANT_TYPE,
		client_id: process.env.CLIENT_ID,
		client_secret: process.env.CLIENT_SECRET
	}
}


const yelpApi = {
	getToken: () => {
		return axios.post('https://api.yelp.com/oauth2/token', qs.stringify(tokenCred));
	},
	getBizInfo: (access_token) => {
		return axios.get(fusionApi, access_token);
	},
	getReviews: (access_token) => {
		return axios.get(`${fusionApi}/reviews`, access_token);
	}
}

module.exports = yelpApi;
