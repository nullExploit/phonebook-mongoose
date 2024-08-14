const { GraphQLString } = require("graphql");
const PhoneBookType = require("../types/phonebooks");
const PhoneBook = require("../../models/PhoneBook");
const { Types } = require("mongoose");

const PhoneBookMutationType = {
  addphonebook: {
    type: PhoneBookType,
    args: {
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: (_, args) => {
      const { name, phone } = args;
      const phoneBookObj = new PhoneBook({
        name,
        phone,
      });
      return phoneBookObj.save();
    },
  },
  removephonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: (_, args) => {
      return PhoneBook.deleteOne({ _id: new Types.ObjectId(args.id) });
    },
  },
  updatephonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: (_, args) => {
      const { id, name, phone } = args;
      return PhoneBook.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        { name, phone }
      );
    },
  },
  updateavatarphonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
      avatar: { type: GraphQLString },
    },
    resolve: (_, args) => {
      const { id, avatar } = args;
      return PhoneBook.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        { avatar }
      );
    },
  },
};

module.exports = PhoneBookMutationType;
