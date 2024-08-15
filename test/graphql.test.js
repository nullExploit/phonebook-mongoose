const chai = require("chai");
const chaiHttp = require("chai-http");

chai.should();
chai.use(chaiHttp);

const PhoneBook = require("../models/PhoneBook");
const app = require("../app");

describe("phonebooks", () => {
  after((done) => {
    PhoneBook.deleteMany({ name: { $regex: new RegExp("@@TESTING@@") } }).then(
      () => {
        done();
      }
    );
  });

  it("Should get all phonebook with 'GET' method", (done) => {
    chai
      .request(app)
      .get("/graphql?query={phonebooks{id,name,phone,avatar}}")
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(200);
        res.should.be.json;
        res.body.data.should.be.a("object");
        res.body.data.phonebooks.should.be.a("array");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.be.a("object");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("id");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("name");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("phone");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("avatar");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].id.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].name.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].phone.should.be.a("string");
        done();
      });
  });

  it("Should limit and paginate phonebook with 'GET' method", (done) => {
    chai
      .request(app)
      .get("/graphql?query={phonebooks(limit:2){id,name,phone,avatar}}")
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(200);
        res.should.be.json;
        res.body.data.should.be.a("object");
        res.body.data.phonebooks.should.be.a("array");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.be.a("object");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("id");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("name");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("phone");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("avatar");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].id.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].name.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].phone.should.be.a("string");
        res.body.data.phonebooks.length.should.equal(2);
        done();
      });
  });

  it("Should sort phonebook with 'GET' method", (done) => {
    chai
      .request(app)
      .get("/graphql?query={phonebooks(sort:-1){id,name,phone,avatar}}")
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(200);
        res.should.be.json;
        res.body.data.should.be.a("object");
        res.body.data.phonebooks.should.be.a("array");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.be.a("object");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("id");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("name");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("phone");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].should.have.property("avatar");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].id.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].name.should.be.a("string");
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].phone.should.be.a("string");
        res.body.data.phonebooks[0].name.should.match(/[z]/gi);
        res.body.data.phonebooks[
          res.body.data.phonebooks.length - 1
        ].name.should.match(/[a]/gi);
        done();
      });
  });

  it("Should create phonebooks with 'POST' method", (done) => {
    const query = `
    mutation addPhoneBook($name: String!, $phone: String!) {
      addphonebook(name: $name, phone: $phone) {
        id,
        name,
        phone,
        avatar
      }
    }
    `;
    const variables = {
      name: "@@TESTING@@ POST",
      phone: "08111111111",
    };
    chai
      .request(app)
      .post("/graphql")
      .send({ query, variables })
      .end((err, res) => {
        if (err) throw new Error("Failed while testing phonebooks");
        res.should.have.status(200); // Should be 201, but because it's GraphQL status code won't work
        res.should.be.json;
        res.body.data.should.be.a("object");
        res.body.data.addphonebook.id.should.be.a("string");
        res.body.data.addphonebook.name.should.be.a("string");
        res.body.data.addphonebook.phone.should.be.a("string");
        res.body.data.addphonebook.name.should.equal("@@TESTING@@ POST");
        res.body.data.addphonebook.phone.should.equal("08111111111");
        done();
      });
  });

  it("Should edit phonebooks with 'POST' method", (done) => { // Should be 'PUT' method, but GraphQL does'nt support such a thing
    chai
      .request(app)
      .get(
        `/graphql?query={phonebook(name:"@@TESTING@@ POST"){id,name,phone,avatar}}`
      )
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        const query = `
        mutation updatePhoneBook($id: String!, $name: String!, $phone: String!) {
          updatephonebook(id: $id, name: $name, phone: $phone) {
            id,
            name,
            phone,
            avatar
          }
        }
        `;
        const variables = {
          id: response.body.data.phonebook[0].id,
          name: "@@TESTING@@ PUT",
          phone: "08123456789",
        };
        chai
          .request(app)
          .post("/graphql")
          .send({ query, variables })
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(200); // Should be 201, but because it's GraphQL status code won't work
            res.should.be.json;
            res.body.data.updatephonebook.should.be.a("object");
            res.body.data.updatephonebook.id.should.be.a("string");
            res.body.data.updatephonebook.name.should.be.a("string");
            res.body.data.updatephonebook.phone.should.be.a("string");
            res.body.data.updatephonebook.name.should.equal("@@TESTING@@ PUT");
            res.body.data.updatephonebook.phone.should.equal("08123456789");
            done();
          });
      });
  });

  it("Should update avatar phonebooks with 'POST' method", (done) => { // Should be 'PUT' method, but GraphQL does'nt support such a thing
    chai
    chai
      .request(app)
      .get(
        `/graphql?query={phonebook(name:"@@TESTING@@ PUT"){id,name,phone,avatar}}`
      )
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        const query = `
        mutation updateAvatarPhoneBook($id: String!, $avatar: String!) {
          updateavatarphonebook(id: $id, avatar: $avatar) {
            id,
            name,
            phone,
            avatar
          }
        }
        `;
        const variables = {
          id: response.body.data.phonebook[0].id,
          avatar: "picture.jpg",
        };
        chai
          .request(app)
          .post("/graphql")
          .send({ query, variables })
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(200); // Should be 201, but because it's GraphQL status code won't work
            res.should.be.json;
            res.body.data.should.be.a("object");
            res.body.data.updateavatarphonebook.id.should.be.a("string");
            res.body.data.updateavatarphonebook.name.should.be.a("string");
            res.body.data.updateavatarphonebook.phone.should.be.a("string");
            res.body.data.updateavatarphonebook.avatar.should.be.a("string");
            res.body.data.updateavatarphonebook.name.should.equal(
              "@@TESTING@@ PUT"
            );
            res.body.data.updateavatarphonebook.phone.should.equal(
              "08123456789"
            );
            res.body.data.updateavatarphonebook.avatar.should.equal(
              "picture.jpg"
            );
            done();
          });
      });
  });

  it("Should delete phonebooks with 'POST' method", (done) => { // Should be 'DELETE' method, but GraphQL does'nt support such a thing
    chai
    chai
      .request(app)
      .get(
        `/graphql?query={phonebook(name:"@@TESTING@@ PUT"){id,name,phone,avatar}}`
      )
      .end((error, response) => {
        if (error) throw new Error("Failed while testing phonebooks");
        const query = `
        mutation removePhoneBook($id: String!) {
          removephonebook(id: $id) {
            id,
            name,
            phone,
            avatar
          }
        }
        `;
        const variables = {
          id: response.body.data.phonebook[0].id,
        };
        chai
          .request(app)
          .post("/graphql")
          .send({ query, variables })
          .end((err, res) => {
            if (err) throw new Error("Failed while testing phonebooks");
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a("object");
            res.body.data.should.be.a("object");
            res.body.data.removephonebook.should.be.a("object");
            done();
          });
      });
  });
});
