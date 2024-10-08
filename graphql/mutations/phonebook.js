const { GraphQLString } = require("graphql");
const PhoneBookType = require("../types/phonebooks");
const PhoneBook = require("../../models/PhoneBook");
const { Types } = require("mongoose");
const { readdirSync, unlinkSync } = require("fs");
const path = require("path");

const PhoneBookMutationType = {
  addphonebook: {
    type: PhoneBookType,
    args: {
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { name, phone } = args;
      const phonebook = await PhoneBook.create({ name, phone });
      return phonebook;
    },
  },
  removephonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      for (let file of readdirSync(
        path.join(__dirname, "..", "..", "..", "phonebook-uploads", "mongoose")
      )) {
        if (file.split("-")[1] == args.id) {
          unlinkSync(
            path.join(
              __dirname,
              "..",
              "..",
              "..",
              "phonebook-uploads",
              "mongoose",
              file
            )
          );
        }
      }
      const phonebook = PhoneBook.deleteOne({
        _id: new Types.ObjectId(args.id),
      });
      return phonebook;
    },
  },
  updatephonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      phone: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { id, name, phone } = args;
      const phonebook = await PhoneBook.findByIdAndUpdate(
        { _id: new Types.ObjectId(id) },
        { name, phone },
        { new: true }
      );
      return phonebook;
    },
  },
  updateavatarphonebook: {
    type: PhoneBookType,
    args: {
      id: { type: GraphQLString },
      avatar: { type: GraphQLString },
    },
    resolve: async (_, args) => {
      const { id, avatar } = args;
      const phonebook = await PhoneBook.findByIdAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        { avatar },
        { new: true }
      );
      return phonebook;
    },
  },
};

module.exports = PhoneBookMutationType;
