let chai = require('chai');
let chaiHttp = require('chai-http');
let chaiAsPromised = require('chai-as-promised');
let server = require('../server');

//Assertion Style
chai.should();

chai.use(chaiHttp);
chai.use(chaiAsPromised);

describe('Ads API', () => {
  /**
   * Test the GET/search/all route
   */
  describe('GET /search/all', () => {
    it('It should GET all the ads', async (done) => {
      await chai
        .request(server)
        .get('/search/all')
        .then((err, response) => {
          response.should.eventually.have.status(200);
          response.body.should.eventually.be.a('array');
          response.body.length.should.eventually.be.eq(4);
          done();
        });
    });

    it('It should NOT GET all the ads', (done) => {
      chai
        .request(server)
        .get('/all')
        .end((err, response) => {
          response.should.have.status(404);
          done();
        });
    })
  });

  /**
   * Test the GET/search route
   */
  describe('GET /search/:q', () => {
    it('It should GET an ad by keyword', (done) => {
      const existent = 'boats';
      chai
        .request(server)
        .get('/search?q=' + existent)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.a('arrayt');
          response.body.should.have.deep.property('_id');
          response.body.should.have.property('title');
          response.body.should.have.property('link');
          response.body.should.have.property('description');
          done();
        });
    });

    it('It should NOT GET an ad by keyword', (done) => {
      const nonExistent = 'nonExistent';
      chai
        .request(server)
        .get('/search?q=' + nonExistent)
        .end((err, response) => {
          response.should.have.status(200);
          response.body.should.be.eq('array');
          response.body.length.should.be.eq(0);
          done();
        });
    });
  });
});
