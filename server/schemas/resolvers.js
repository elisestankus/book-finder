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
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

    },
};

module.exports = resolvers;