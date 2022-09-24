import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import server from "../app";

chai.use(chaiHttp);

describe("Categories route", () => {
  it("should return all categories", (done) => {
    chai.request(server)
      .get("/category")
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.a('array');
        done();
      })
  });
})