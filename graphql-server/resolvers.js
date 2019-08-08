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
      const user = await User.findOne({_id: context.user.id});
      const result = await User.findOne({name: {$regex: new RegExp(profile.name, "i")}, _id: {$ne: user._id}});
      if (result) {
        return new UserInputError("Name is already taken");
      } else {
        return await User.findOneAndUpdate({_id: context.user.id}, profile, {new: true})
      }
    }
  },
  DateTime: GraphQLDateTime
};