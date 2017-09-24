const util = require('util');

const axios = require('axios');

const yelpApi = require('./yelp');

const helpers = require('./helpers');

const controller = {
	renderIndex: (req, res) => {
		console.log('root fired');
		yelpApi.getToken()
		.then((data) => {
			console.log('promise 1 fired');
			console.log(data.data);
			const access_token = {
				headers: {
					'Authorization': `Bearer ${data.data.access_token}`
				}
			}
			axios.all([yelpApi.getBizInfo(access_token), yelpApi.getReviews(access_token)])
			.then(axios.spread((bizInfo, reviewInfo) => {
				console.log(`bizInfo ${util.inspect(bizInfo.data)}`);
				console.log(`reviews ${util.inspect(reviewInfo.data)}`);
				let openRes = bizInfo.data.hours[0].open;
				let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
				let open = [];
				for(let i in openRes) {
					const hours = {
						day: days[i],
						open: helpers.timeConvert(openRes[i].start),
						close: helpers.timeConvert(openRes[i].end)
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
				const data = {
					open, reviews,
					noRevs: bizInfo.data.review_count,
					rating: bizInfo.data.rating,
					ratingArr: Array.from({length: Math.floor(bizInfo.data.rating)}),
					url: bizInfo.data.url
				}
				console.log(util.inspect(data));
				res.render('index.hbs', {data});
			}));
		})
		.catch((err) => {
			console.log(`catch err ${err}`);
		});
	}
}

module.exports = controller;
