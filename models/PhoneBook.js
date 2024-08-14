const { Schema, model } = require("mongoose");

const PhoneBookSchema = new Schema(
  {
    name: { type: String },
    phone: { type: String },
    avatar: { type: String, default: null },
  },
  { timestamps: true }
);

const PhoneBook = model("PhoneBook", PhoneBookSchema);

module.exports = PhoneBook;
