const { GraphQLList, GraphQLString } = require("graphql");
const { Types } = require("mongoose");
const PhoneBook = require("../../models/PhoneBook");
const PhoneBookType = require("../types/phonebooks");

const PhoneBookQueryType = {
  phonebooks: {
    type: new GraphQLList(PhoneBookType),
    resolve: () => {
      return PhoneBook.find({});
    },
  },
  phonebook: {
    type: new GraphQLList(PhoneBookType),
    args: {
      id: { type: GraphQLString },
    },
    resolve: (_,args) => {
      return PhoneBook.find({ _id: new Types.ObjectId(args.id) });
    },
  },
};

module.exports = PhoneBookQueryType;
