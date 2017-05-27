const graphql = require('graphql');
const _ = require('lodash');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} = graphql;

const users = [
  { id: '23', firstName: 'Bill', age: 20 },
  { id: '42', firstName: 'Sarah', age: 22 }
]

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString } ,
    firstName: { type: GraphQLString } ,
    age: { type: GraphQLInt }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString } },
      // resolve function is used to actually obtain our data
      resolve(parentValue, args) {
        return _.find(users, { id: args.id });
      }
    }
  }
});
