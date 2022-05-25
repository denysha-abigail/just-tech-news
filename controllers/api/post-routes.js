const router = require('express').Router();
// we include the User model for the post-routes because we want to retrieve not only information about each post, but also the user that posted it; with the foreign key user_id, we can form a JOIN
const { Post, User, Vote, Comment } = require('../../models');
const sequelize = require('../../config/connection');
const withAuth = require('../utils/auth');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    // first, we'll account for the other columns that we'll retrieve in this query 
    Post.findAll({
        order: [['created_at', 'DESC']],
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        // the order property is assigned a nested array that orders by the created_at column in descending order to ensure the lated posted articles appear first
        // and then account for the JOIN to the User table
        // notice that the include property is expressed as an array of objects; to define this object, we need a reference to the model and attributes
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    // note that the Comment model will also include the User model itself so it can attach the username to the comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get a single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            if (!dbPostData) {
                // 404 identifies a user error and will need a different request for a successful response
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', withAuth, (req, res) => {
    // we are using req.body to populate the columns in the post table
    // INSERT INTO post (title, post_url, user_id, created_at, updated_at) VALUES ("Taskmaster goes public!", "https://taskmaster/press", 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
    // similar to the SQL query --> INSERT INTO
    // We did not assign the created_at or updated_at fields in req.body; sequelize allows the values for these fields to be assigned automatically with CURRENT_TIMESTAMP values, which allows us to NOT include it on the request
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.session.user_id
    })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// PUT /api/posts/upvote
// goes before the /:id PUT route; otherwise Express.js will think the word 'upvote' is a valid parameter for /:id
router.put('/upvote', withAuth, (req, res) => {
    // make sure the session exists first before even touching the database
    if (req.session) {
        // if a session does exist, we're using the saved user_id property on the session to insert a new record in the vote table
        // pass session id along with all destructure properties on req.body
        // custom static method created in models/Post.js
        Post.upvote({ ...req.body, user_id: req.session.user_id }, { Vote, Comment, User })
            .then(updatedVoteData => res.json(updatedVoteData))
            .catch(err => {
                console.log(err);
                res.status(500).json(err);
            });
    }
});

// when testing in insomnia, the response may be just a 1 but it is SQL's way of verifying that the number of rows changed in the last query
router.put('/:id', withAuth, (req, res) => {
    Post.update(
        // use request parameter to find the post, then used the req.body.title value to replace the title of the post
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        // in the response, we sent back data that has been modified and stored in the database
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', withAuth, (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;