const axios = require('axios'),
			qs 		=	require('querystring');

const config = require('../config/config');

const yelpApi = {
	getToken: () => {
		return axios.post('https://api.yelp.com/oauth2/token', qs.stringify(config.tokenCred));
	},
	getBizInfo: (access_token) => {
		return axios.get(config.fusionApi, access_token);
	},
	getReviews: (access_token) => {
		return axios.get(`${config.fusionApi}/reviews`, access_token);
	}
}

module.exports = yelpApi;
