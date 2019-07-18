import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';

import User from 'models/User';

export default {
  Query: {
    me: async (_, args, context) => await User.findById(context.user.id),
  },
  DateTime: GraphQLDateTime
};