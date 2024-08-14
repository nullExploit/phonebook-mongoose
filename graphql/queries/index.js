const { GraphQLObjectType } = require("graphql");
const PhoneBookQueryType = require("./phonebook");

const QueryType = new GraphQLObjectType({
  name: "QueryType",
  fields: {
    ...PhoneBookQueryType,
  },
});

module.exports = QueryType;
