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
    User.findAll()
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

// PUT /api/users/1
// to update existing data
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // this .update() method combines the parameters for creating data and looking up data; we pass in req.body to provide the new data we want to use in the update and req.params.id to indicated where exactly we want that new data to be used
    // similar to SQL query --> UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
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