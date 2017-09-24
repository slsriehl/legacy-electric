const express = require('express');
const router = new express.Router;

const controller = require('../controllers/get');

router.get('/', (req, res) => {
	controller.renderIndex(req, res);
})

module.exports = router;
