const { GraphQLObjectType, GraphQLString } = require("graphql");

const PhoneBookType = new GraphQLObjectType({
  name: "PhoneBookType",
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    phone: { type: GraphQLString },
    avatar: { type: GraphQLString },
  },
});

module.exports = PhoneBookType;
