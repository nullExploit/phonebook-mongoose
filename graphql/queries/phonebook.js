const { GraphQLList, GraphQLString, GraphQLInt } = require("graphql");
const { Types } = require("mongoose");
const PhoneBook = require("../../models/PhoneBook");
const PhoneBookType = require("../types/phonebooks");

const PhoneBookQueryType = {
  phonebooks: {
    type: new GraphQLList(PhoneBookType),
    args: {
      sort: { type: GraphQLInt, defaultValue: 1 },
      keyword: { type: GraphQLString, defaultValue: "" },
      limit: { type: GraphQLInt, defaultValue: null },
      page: { type: GraphQLInt, defaultValue: 1 },
    },
    resolve: async (_, args) => {
      const { sort, keyword, limit, page } = args;
      if (!limit) {
        return await PhoneBook.find({
          $or: [
            { name: { $regex: new RegExp(keyword, "i") } },
            { phone: { $regex: new RegExp(keyword, "i") } },
          ],
        })
          .sort({ name: sort })
          .exec();
      }
      return await PhoneBook.find({
        $or: [
          { name: { $regex: new RegExp(keyword, "i") } },
          { phone: { $regex: new RegExp(keyword, "i") } },
        ],
      })
        .sort({ name: sort })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();
    },
  },
  phonebook: {
    type: new GraphQLList(PhoneBookType),
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { id, name, phone } = args;
      if (name) return await PhoneBook.find({ name }).exec();
      if (phone) return await PhoneBook.find({ phone }).exec();
      return await PhoneBook.find({ _id: new Types.ObjectId(id) }).exec();
    },
  },
  totalphonebook: {
    type: GraphQLInt,
    args: {
      keyword: { type: GraphQLString, defaultValue: "" },
    },
    resolve: async (_, args) => {
      return await PhoneBook.countDocuments({
        $or: [
          { name: { $regex: new RegExp(args.keyword, "i") } },
          { phone: { $regex: new RegExp(args.keyword, "i") } },
        ],
      }).exec();
    },
  },
};

module.exports = PhoneBookQueryType;
