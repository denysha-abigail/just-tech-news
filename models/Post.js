// include connection to MySQL that we stored in the connection.js file as well as Model and Datatypes we'll use from the sequelize package
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create POST model
class Post extends Model {}

// create fields/columns
// here we will define the columns in the Post, configure the naming conventions, and pass the current connection instance to initialize the Post model

Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            // ensure URL is a verified link
            validate: {
                isURL: true
            }
        },
        // this column determines who posted the news article
        user_id: {
            type: DataTypes.INTEGER,
            // using the references property, we establish a relationship between this post and the user by creating a reference to the User model, specifically to the id column that is defined by the key property, which is the primary key
            // the user_id is conversely defined as the foreign key and will be the matching link
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    // configure the metadata (a set of data that describes and gives information about other data) and include the naming conventions
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

// must include export expression to make the Post model accessible to other parts of the application
module.exports = Post;