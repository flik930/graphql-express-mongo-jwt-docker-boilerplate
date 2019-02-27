import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';

export default {
  Query: {
    me: async (_, args, context) => await User.findById(context.user._id),
  },
  DateTime: GraphQLDateTime
};