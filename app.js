var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { createHandler } = require("graphql-http/lib/use/express");
var { readdirSync, unlinkSync } = require("fs");
var rootValue = require("./graphql/queries");
var mongoose = require("mongoose");
var schema = require("./graphql/");
var cors = require("cors");
var fileUpload = require("express-fileupload");
var path = require("path");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/phonebookdb");
}

var app = express();

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  express.static(path.join(__dirname, "..", "phonebook-uploads", "mongoose"))
);
app.use(cookieParser());
app.use(fileUpload());
const router = express.Router();

router.put("/:id", async (req, res) => {
  const id = req.params.id;
  const file = req.files?.file;
  const fileName = `${Date.now()}-${id}-${file?.name}`;
  const filePath = path.join(
    __dirname,
    "..",
    "phonebook-uploads",
    "mongoose",
    fileName
  );

  for (let file of readdirSync(
    path.join(__dirname, "..", "phonebook-uploads", "mongoose")
  )) {
    if (file.split("-")[1] == id) {
      unlinkSync(
        path.join(__dirname, "..", "phonebook-uploads", "mongoose", file)
      );
    }
  }

  file && (await file.mv(filePath));
  res.json(file ? { fileName } : {});
});

app.use("/upload", cors(), router);

app.all(
  "/graphql",
  cors(),
  createHandler({
    schema,
    rootValue,
  })
);

module.exports = app;
