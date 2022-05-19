const router = require('express').Router();
// we include the User model for the post-routes because we want to retrieve not only information about each post, but also the user that posted it; with the foreign key user_id, we can form a JOIN
const { Post, User } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    // first, we'll account for the other columns that we'll retrieve in this query 
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        // and then account for the JOIN to the User table
        // notice that the include property is expressed as an array of objects; to define this object, we need a reference to the model and attributes
        include: [
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
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
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

module.exports = router;