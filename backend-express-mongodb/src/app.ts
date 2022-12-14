console.log(process.env);

import express from 'express';

import { graphqlHTTP } from 'express-graphql';

import { buildSchema } from 'graphql';

import cors from 'cors';

import mongoose from 'mongoose';

import adminRoute from './routes/admin';

import { initFetchData } from './fetch-data';

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.use('/', adminRoute);

initFetchData();

const port = process.env.PORT || 8080;

mongoose.connect(`${process.env.DB_HOST_ATLAS}`)
  .then(() => {
    app.listen(port, () => console.log(`Server and database running on port ${port}, http://localhost:${port}`));
  })
  .catch((err: any) => {
    console.log(err);
  });

export default app;