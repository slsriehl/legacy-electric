const nodemailer = require('nodemailer');

const moment = require('moment-timezone');

const ReCAPTCHA = require('recaptcha2');

const config = require('../config/config');

let env = process.env.NODE_ENV.toUpperCase();

//variables for email auth
let receiveAddr = config[env].receiveAddr;
let siteKey = config[env].captcha.siteKey;
let secretKey = config[env].captcha.secretKey;
let smtpAuth = config[env].smtpAuth;

//create the smtp transport
const transporter = Promise.promisifyAll(nodemailer.createTransport(smtpAuth));

//controller function to export
const controller = {
	dispatchMail: (req, res) => {
		//req.body
		console.log(req.body);
		//create the message
		let message = '';
		const messageArr = req.body.message.split("\n");
		for(let i = 0; i < messageArr.length; i++) {
			message += `<p>${messageArr[i]}</p>`;
		}
		//create the mail object
		const mailOptions = {
			from: `"legacyelectricaustin.com" <${sendAddr}>`,
			to: receiveAddr,
			subject: 'new message from legacyelectricaustin.com',
			html: `<h2>name: ${req.body.name}</h2><h2>email: ${req.body.email} </h2><h2>phone: ${req.body.tel}</h2><h2>message</h2>${message}<p>date: ${moment().tz('America/Chicago').format('ddd, MMMM Do, YYYY h:mm a Central Time')}</p>`
		}
		console.log(mailOptions);

		console.log(smtpAuth);

		//create the recaptcha object
		// const recaptcha = new ReCAPTCHA({
		//   siteKey,
		//   secretKey
		// });
		//check the captcha and send the mail
		// return recaptcha.validateRequest(req)
		// .then((success) => {
			return transporter.sendMailAsync(mailOptions)
		//})
		.then((success) => {
			console.log(success);
			res.send(true);
			return Promise.resolve(true)
		})
		.catch((err) => {
			console.log(err);
			res.send(false);
			return Promise.resolve(false);
		});
	}
}

module.exports = controller;
