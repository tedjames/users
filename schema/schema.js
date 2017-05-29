const graphql = require('graphql');
const axios = require('axios');
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList
} = graphql;

// Node in our graph
const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // Arrow function used here to give access to UserType, thus resolving the closure issue
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: { // Find users who work at this company given this node's id field (parentValue.id)
      type: new GraphQLList(UserType), // new GraphQLList() is used when returning multiple data objects (aka nodes)
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
          .then(res => res.data);
      }
    }
  })
});

// Another node...
const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: { // Find the company this user works at given a companyId from this user
      type: CompanyType,
      resolve(parentValue, args) {
        // here we fetch data using this own node's data object (aka parentValue)
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
          .then(res => res.data);
      }
    }
  })
});

// RootQuery is a smart node that sits at the center of our graph
// it's used to encapsulate and feed our nodes w/ data
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: { // Find me a user given an ID
      type: UserType, // type is used to define which node this encapsulates
      args: { id: { type: GraphQLString } }, // args to be used for resolver
      resolve(parentValue, args) { // resolver is used to fetch data for this node using args (aka a promise)
        return axios.get(`http://localhost:3000/users/${args.id}`)
          .then(resp => resp.data); // return only resp.data (an axios thing)
      }
    },
    company: { // Find me a company given an ID
      type: CompanyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`)
          .then(resp => resp.data);
      }

    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQuery
});
