const { Model, DataTypes } = require("sequelize");
const sequelize = require('../config/connection');

// create our User model
// this Model class is what we create our own models from using the extends keyword so User inherits all of the below functionality
class User extends Model {}

// define table columns and configuration
// one the User class is created, we use the .init() method to initialize the model's data and configuration, passing in two objects as arguments
// the first object: defines the columns and data types for those columns
// the second object: accepts and configures certain options for the table
User.init(
    // each column gets its own type definition (where we use the imported Sequelize DataTypes object to define what type of data it will be); we also applied other options found in SQL, such as allowNULL (NOT NULL in MySQL) and autoIncrement (AUTO INCREMENT in MySQL)
    {
        // define an id column
        id: {
            // use the special Sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            // if we didn't define the model to have a primaryKey option set up anywhere, Sequelize would create one for use, but it's best we explicitly define ALL of the data
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data 
            // Sequelize's built-in validators
            validate: {
                // ensures any email data follows the pattern of an email address (i.e., <string>@<string>.<string>)
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least for characters long
                len: [4]
            }
        }
    },
    {
        // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

        // pass in our imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

// export newly created model so it can be used in other parts of the app
model.exports = User;