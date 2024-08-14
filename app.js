var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { createHandler } = require("graphql-http/lib/use/express");
const rootValue = require("./graphql/queries");
const mongoose = require("mongoose");
const schema = require("./graphql/")

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/phonebookdb");
}

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.all("/graphql", createHandler({
    schema,
    rootValue
}))

module.exports = app;
