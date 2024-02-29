const { User } = require('../models')
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        // query to find logged in user using context from JWT data
        me: async(parent, args, context) => {
            if (context.user) {
                return User.findOne({
                    _id: context.user._id
                });
            }
            throw AuthenticationError;
        },
    },

    Mutation: {

    },
};

module.exports = resolvers;