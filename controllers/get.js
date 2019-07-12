const util = require('util');

const moment = require('moment-timezone');

const yelpApi = require('./yelp');

const about = require('../data/about');
const team = require('../data/team');
const services = require('../data/services');

const config = require('../config/config');

let env = process.env.NODE_ENV.toUpperCase();

let siteKey = config[env].captcha.siteKey;

const controller = {
	renderIndex: (req, res) => {
		console.log('root fired');
		return Promise.all([
			yelpApi.getBizInfo(),
			yelpApi.getReviews()
		])
		.then(([bizInfo, reviewInfo]) => {
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
				hoursReviews, about, team, services, siteKey
			});
			return Promise.resolve(true);
		})
		.catch((err) => {
			console.log(err);
			return Promise.resolve(false);
		});
	}
}

module.exports = controller;
