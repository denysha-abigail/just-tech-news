// objects generated from classes are instances of the class
const router = require('express').Router();
const { User } = require('../../models');

// naming conventions (i.e /api/users, /api/posts, /api/comments), along with the use of HTTP methods follow a famous API architectural pattern called REST, or Representational State Transfer; APIs built following this pattern are what's known as RESTful APIs
// some guidelines => name endpoints in a way that describes the data you're interfacing with, usee HTTP methods like get, post, put, and delete to describe the action you're performing to interface with that endpoint (GET /api/users - you should expect to receive user data), and use the propert HTTP status codes like 400, 404, and 500 to indicate errors in a request
// RESTful APIs are no language or library, but rather a pattern that developers use when building an API 

// GET /api/users
// set up API endpoint so that when the client makes a GET request to /api/user, we will select all users from the user table in the database and send it back as JSON
router.get('/', (req, res) => {
    // access our User model and run .findAll () method
    // .findAll() method lets us query all of the users from the user table in the database which is equivalent to SQL query statement --> SELECT * FROM users;
    // because sequelize is javascript promise-based library, meaning we can use .then() with all of the model methods
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// GET /api/users/1
// only returns one used based on its req.params.id value
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        // using where option to indicate we want to find a user where its id value equals whatever req.params.id is, similar to SQL query --> SELECT * FROM users Where id = 1
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                // if we search for a user with a nonexistent id value, we'll send back a 404 status to indicate everything is ok but they asked for the wrong piece of data
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // to insert data we can use sequelize's .create() method; pass in key/value pairs where the keys are what we defined in the User model and the values are what we get from req.body
    // similar to SQL query --> INSERT INTO users (username, email, password) VALUES ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// this route will be found at http://localhost:3001/api/users/login
// POST is the standard for the loging that's in process
// GET carries the request parameter appended in the URL string; POST, on the other hand, carries the request parameter in req.body (which makes it a more secure way of transferring data from the client to the server)
router.post('/login', (req, res) => {
    // expectd {email: 'lernantino@gmail.com', password: 'password1234'}
    // query the User table using the findOne() method for the email entered by the user and assigned it to req.body.email
    // .findOne() sequelize method looks for a user with the specified email
    User.findOne({
        where: {
            email: req.body.email
        }
    // the result of the query is passed as dbUserData to the .then() part of the .findOne() method; 
    }).then(dbUserData => {
        if(!dbUserData) {
            // if user with that email not found, a message is sent back as a response to the client
            res.status(400).json({ message: 'No user with that email address! '});
            return;
        }
        // if email was found in the database, the next step would be to verify the user's identity by matching the password from the user and the hashed password in the database
        // verify user
        // if query result is succcessful, we can call .checkPassword(), which will be on the dbUserData object; we'll need to pass the plaintext password (stored in req.body.password) into .checkPassword() as the argument
        // the .compareSync() method (which is inside .checkPassword() method) can then confirm or deny that the supplied password matches the hashed password stored on the object; 
        // .checkPassword() will then return true on success or false on failure; we'll store this boolean value to the validPassword variable
        // note that the instance method was called on the user retrieved from the database, dbUserData (because it returns a boolean, we can use it in a conditional statement to verify whether the user has been verified or not)
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            // if match returns false value, an error message is sent back to the client; the return exits out of the function immediately
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        // if there is a match, the conditional statement block is ignored, and a response with the data and message below are sent instead
        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
});

// PUT /api/users/1
// to update existing data
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // this .update() method combines the parameters for creating data and looking up data; we pass in req.body to provide the new data we want to use in the update and req.params.id to indicated where exactly we want that new data to be used
    // similar to SQL query --> UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
        // for hook to be effective, we must add this option to the query call
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
// to delete user from database
router.delete('/:id', (req, res) => {
    // to delete data use the .destroy() method and provide some type of identifier to indicate where exactly we would like to delete data from the user database table
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData)
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;