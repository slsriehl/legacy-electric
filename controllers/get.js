const util = require('util');

const axios = require('axios');

const moment = require('moment');

const yelpApi = require('./yelp');

const about = require('../data/about');
const team = require('../data/team');
const homes = require('../data/homes');

let siteKey;
if(!process.env.CONFIG) {
	siteKey = require('../config/config').siteKey;
} else {
	siteKey = process.env.SITE_KEY;
}

const controller = {
	renderIndex: (req, res) => {
		console.log('root fired');
		return yelpApi.getToken()
		.then((data) => {
			console.log('promise 1 fired');
			console.log(data.data);
			const access_token = {
				headers: {
					'Authorization': `Bearer ${data.data.access_token}`
				}
			}
			return axios.all([
				yelpApi.getBizInfo(access_token),
				yelpApi.getReviews(access_token)
			])
		})
		.then(axios.spread((bizInfo, reviewInfo) => {
			console.log(`bizInfo ${util.inspect(bizInfo.data)}`);
			console.log(`reviews ${util.inspect(reviewInfo.data)}`);
			let openRes = bizInfo.data.hours[0].open;
			let open = [];
			for(let i in openRes) {
				const hours = {
					day: moment((openRes[i].day + 1), 'e').format('dddd'),
					open: moment(openRes[i].start, 'HHmm').format('h:mm a'),
					close: moment(openRes[i].end, 'HHmm').format('h:mm a')
				}
				open.push(hours);
			}
			let reviews = [];
			for(let i in reviewInfo.data.reviews) {
				let review = {
					url, text, user, rating
				} = reviewInfo.data.reviews[i];
				review.time_created = moment(reviewInfo.data.reviews[i].time_created).format("MMM Do, YYYY h:mm a");
				review.ratingArr = Array.from({length: Math.floor(reviewInfo.data.reviews[i].rating)})
				reviews.push(review);
			}
			const hoursReviews = {
				open,
				reviews,
				noRevs: bizInfo.data.review_count,
				rating: bizInfo.data.rating,
				ratingArr: Array.from({
					length: Math.floor(bizInfo.data.rating)
				}),
				url: bizInfo.data.url
			}

			res.render('index.hbs', {
				hoursReviews, about, team, homes, siteKey
			})
		}))
		.catch((err) => {
			console.log(err);
		});
	}
}

module.exports = controller;
