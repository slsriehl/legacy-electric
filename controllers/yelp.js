const axios = require('axios');

const qs = require('querystring');

const config = require('../config/config');

let env = process.env.NODE_ENV.toUpperCase();

// let authEndpoint = config[env].yelp.endpoint.auth;
let dataEndpoint = config[env].yelp.endpoint.data;
let apiKey = config[env].yelp.apiKey;

const headers = {
	"Authorization": `Bearer ${apiKey}`
}

const getYelpData = (endpoint, options) => {
	return axios.get(endpoint, options)
	.catch(error => {
		console.log('AXIOS GET ERROR !!')
		console.log(error);
		return Promise.reject(error);
	});
}


const yelpApi = {
	// getToken: () => {
	// 	return axios.post(authEndpoint, qs.stringify(tokenCred));
	// },
	getBizInfo: () => {
		let endpoint = dataEndpoint;
		let options = {
			headers
		}
		return getYelpData(endpoint, options);
	},
	getReviews: () => {
		let endpoint = `${dataEndpoint}/reviews`;
		let options = {
			headers
		}
		return getYelpData(endpoint, options);
	}
}

module.exports = yelpApi;
