const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // query to find logged in user using context from JWT data
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({
                    _id: context.user._id
                });
            }
            throw AuthenticationError;
        },
    },

    Mutation: {
        // mutation to login a user. finds one user by email --> if user is found, check password --> if password is correct, create a token and return the token and the user
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw AuthenticationError
            }
            const correctPassword = await user.isCorrectPassword(password);
            if (!correctPassword) {
                throw AuthenticationError
            }
            const token = signToken(user);
            return { token, user }
        },
        // mutation to create a new user (signup), returns a signed token and the new user
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },
        // mutation to save a book (subdocument) to a User -- uses context to check if the user is logged in
        saveBook: async (parent, { bookId, authors, description, image, link, title }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    {
                        _id: context.user._id
                    },
                    {
                        $addToSet: { savedBooks: { bookId, authors, description, image, link, title } },
                    },
                    {
                        new: true,
                    }
                );
            }
            throw AuthenticationError
        },
        // mutation to remove a book (subdocument) from a User's savedBooks array 
        removeBook: async (parent, { bookId, authors, description, image, link, title }, context) => {
            if (context.user) {
                return User.findOneAndUpdate(
                    {
                        _id: context.user._id
                    },
                    {
                        $pull: {
                            savedBooks: { bookId, authors, description, image, link, title }
                        }
                    },
                    { 
                        new: true,
                    }
                );
            }
            throw AuthenticationError;
        },
    },
};

module.exports = resolvers;