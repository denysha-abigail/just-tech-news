// all this file is responsible for at the moment is importing the User model and exporting an object with it as a property

const User = require('./User');
const Post = require('./Post');

// create associations
// a user can make many posts
// one-to-many relationship
User.hasMany(Post, {
    // associated key between two tables
    foreignKey: 'user_id'
});

// but a post only belongs to one user
// we are defining the relationship of the Post model to the User; again, we declare the link to the foreign key, which is designated at user_id in the Post model
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };