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
  }

  type Query {
    me: User
  }
`;