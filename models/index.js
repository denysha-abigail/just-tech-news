// all this file is responsible for at the moment is importing the User model and exporting an object with it as a property

const User = require('./User');
const Post = require('./Post');

module.exports = { User, Post };