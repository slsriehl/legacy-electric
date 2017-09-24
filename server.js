
//express
const	express = require('express'),
			app = express();

//configure data parsing for express
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({
	extended: true
}));

//configure templating
const hbs = require('express-handlebars');

app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/'
}));

app.set('view engine', 'hbs');

//serve static files
app.use(express.static('public'));

//routes
const routes = require('./routes/index');

app.use(routes);

//port
const PORT = process.env.PORT || 3000;

app.listen(PORT, function() {
	console.log('listening to your mom on port ' + PORT);
});
