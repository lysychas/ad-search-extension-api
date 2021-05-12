const app = require('../server');
const supertest = require('supertest');

// MONGO CONNECTION
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.DATABASE_URL || process.argv[2];
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

beforeEach((done) => {
  client.connect(() => done());
});

afterEach((done) => {
  client.close(() => done());
});

describe('Post Endpoints', () => {
  it('should create a new post', async () => {
    const res = await supertest(app).get('/search/all');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeTruthy();
  });
});

test('GET /api/posts', async () => {
  await supertest(app)
    .get('/search/all')
    .expect(200)
    .then((response) => {
      // Check type and length
      expect(Array.isArray(response.body)).toBeTruthy();
      // expect(response.body.length).toEqual(1);

      // // Check data
      // expect(response.body[0]._id).toBe(post.id);
      // expect(response.body[0].title).toBe(post.title);
      // expect(response.body[0].content).toBe(post.content);
    });
});
