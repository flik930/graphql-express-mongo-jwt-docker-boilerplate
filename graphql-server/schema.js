export default `
  scalar DateTime

  interface Node {
    _id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
  }

  type User implements Node {
    _id: ID!
    createdAt: DateTime!
    updatedAt: DateTime
    email: String!
    name: String
    gender: Boolean
    introduction: String
    pictureUrl: String
  }

  type Query {
    me: User!
    profile: Profile!
  }

  type Mutation {
    updateProfile(profile: ProfileInput): Profile
  }

  input ProfileInput {
    name: String
    gender: Boolean
    introduction: String
    pictureUrl: String
  }

  type Profile {
    _id: ID!
    name: String
    gender: Boolean
    introduction: String
    pictureUrl: String
  }
`;