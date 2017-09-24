const nodemailer = require('nodemailer');

const Promise = require('bluebird');

const moment = require('moment-timezone');


const ReCAPTCHA = require('recaptcha2');

//variables for email auth
let receiveAddr;
let siteKey;
let secretKey;

if(!process.env.CONFIG) {
	const config = require('../config/config');
	//recaptcha keys
	siteKey = config.siteKey;
	secretKey = config.secretKey;
	//address to send to
	receiveAddr = config.receiveAddr;
	//smtp authentication object
	smtpAuth = {
		host: config.sendHost,
		port: config.sendPort,
		secure: config.sslEmail,
		auth: {
			user: config.sendAddr,
			pass: config.sendPwd
		}
	}
} else {
	//recaptcha keys
	siteKey = process.env.SITE_KEY;
	secretKey = process.env.SECRET_KEY;
	//address to send to
	receiveAddr = process.env.RECEIVE_ADDR;
	//sslemail status
	let sslEmail;
	if(process.env.SSL_EMAIL == '1') {
		sslEmail = true;
	} else {
		sslEmail = false;
	}
	//smtp authentication object
	smtpAuth = {
		host: process.env.SEND_HOST,
		port: parseInt(process.env.SEND_PORT),
		secure: sslEmail,
		auth: {
			user: process.env.SEND_ADDR,
			pass: process.env.SEND_PWD
		}
	}
}

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
		//   siteKey: siteKey,
		//   secretKey: secretKey
		// });
		//check the captcha and send the mail
		// return recaptcha.validateRequest(req)
		// .then((success) => {
			return transporter.sendMailAsync(mailOptions)
		//})
		.then((success) => {
			console.log(success);
			res.send(true);
		})
		.catch((failure) => {
			console.log(failure);
			res.send(false);
		});
	}
}

module.exports = controller;
