const express = require('express');
// the router instance in routes/index.js collected everything and packaged them up for server.js to use
const routes = require('./controllers');
// importing connection to sequelize
const sequelize = require('./config/connection');
// allows stylesheet to be made available to the client
const path = require('path');
// sets up handlebars.js as app's template engine of choice
const exphbs = require('express-handlebars');
// implement the helper by telling handlebars.js about the helpers file
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

// sets up an Express.js session and connects the session to our Sequelize database
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
      db: sequelize
    })
  };

// middleware is just a function that executes before the function that sends the response back; you can execute multiple middleware functions, too

app.use(session(sess));

const hbs = exphbs.create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// express.static() is a built-in Express.js middleware function that can take all of the contents of a folder and serve them as static assets 
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);

// turn on connection to db and server
// established connection; the .sync() part means that this is sequelize taking the models and connecting them to associated database tables (if it doesn't find a table, it'll create it for you)
// if force was set to true, it would drop and re-create all of the database tables on startup
// changing the force value to true would cause the database connection to sync with the model definitions and associations; by forcing the sync method to true, we will make the tables recreate if there are any association changes, similar to the SQL --> DROP TABLE IF EXISTS; allowing the table to be overwritten and re-created
// sequelize.sync({ force: true }) --> drops tables and recreates them; once you turn on the server with force: true and confirm the database tables were recreated, switch back to using force: false and restart the server one more time just to make sure the changes too hold
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});