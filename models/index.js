// all this file is responsible for at the moment is importing the User model and exporting an object with it as a property

const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// create associations
// a user can make many posts
// one-to-many relationship
User.hasMany(Post, {
    // associated key between two tables
    foreignKey: 'user_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

User.hasMany(Comment, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

Post.hasMany(Comment, {
    foreignKey: 'post_id'
});

// but a post only belongs to one user
// we are defining the relationship of the Post model to the User; again, we declare the link to the foreign key, which is designated at user_id in the Post model
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// with .belongsToMany(), we're allowing both the User and Post models to query each other's information in the context of a vote
// now we can see which users voted on a single post and which posts a single user voted on
// many-to-many relationship
User.belongsToMany(Post, {
    // we instruct the application that the User and Post models will be connected but through the Vote model
    through: Vote,
    // we specify that the name of the Vote model should be displayed as voted_posts when queried on
    as: 'voted_posts',
    // we state that we want the foreign key to be in Vote, which aligns with the fields we set up in the model
    // foreign key constraint - layer of protection from the possibility of a single user voting on one post multiple times
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };