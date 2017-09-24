const express = require('express');
const router = new express.Router;

const getController = require('../controllers/get');

const mailController = require('../controllers/mail');

router.get('/', (req, res) => {
	getController.renderIndex(req, res);
});

router.post('/mail', (req, res) => {
	mailController.dispatchMessage(req, res);
});

module.exports = router;
