import {
  GraphQLDate,
  GraphQLTime,
  GraphQLDateTime
} from 'graphql-iso-date';
import { UserInputError } from 'apollo-server-core'

import User from 'models/User';

export default {
  Query: {
    me: async (_, args, context) => await User.findById(context.user.id),
    profile: async (_, args, context) => await User.findById(context.user.id),
  },
  Mutation: {
    updateProfile: async (_, {profile}, context) => {
      return await User.findOneAndUpdate({_id: context.user.id}, profile, {new: true})
    }
  },
  DateTime: GraphQLDateTime
};