const { GraphQLObjectType } = require("graphql");
const PhoneBookMutationType = require("./phonebook");

const MutationType = new GraphQLObjectType({
  name: "MutationType",
  fields: {
    ...PhoneBookMutationType,
  },
});

module.exports = MutationType;
