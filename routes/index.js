const express 		= require('express'),
			router 			= new express.Router,




router.get('/', function(req, res) {

});

//POST new email
router.post('/api/send', function(req, res) {
	console.log('email send controller');
  console.log(req.body);
	const mailOptions = {
		from: `"${req.body.name}" <${req.body.email}>`, //grab form data from the request body object
		to: email,
		subject: 'new message from legacyelectricaustin.com',
		text: `name: ${req.body.name} \n\n email: ${req.body.email} \n\n phone: ${req.body.phone} \n\n message: ${req.body.message}`
	}
  console.log(`mailOptions ${util.inspect(mailOptions)}`);
  transporter.sendMail(mailOptions, function(err, response) {
    console.log(`transporter.sendMail fired`);
    console.log(`err ${err}`);
    console.log(`response ${response}`);
    if(err) {
      console.log(`err fired`);
      res.send("message not sent.  Try again later or call Legacy Electrical Services.");
    } else if(response) {
      console.log(`response fired`);
      res.send("Message successfully sent!  Look forward to an email or call from Legacy.");
    }
  });
});

module.exports = router;
