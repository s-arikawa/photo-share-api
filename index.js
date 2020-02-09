// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server-express`);
const express = require(`express`);
const expressPlayground = require(`graphql-playground-middleware-express`).default;
const { readFileSync } = require(`fs`);

let users = [
  { "githubLogin": "mHattrup", "name": "Mike Hattrup" },
  { "githubLogin": "gPlake", "name": "Glen Plake" },
  { "githubLogin": "sSchmidt", "name": "Scot Schmidt" }
];
let photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "category": "ACTION",
    "githubUser": "gPlake",
    "created": "3-28-1977"
  },
  {
    "id": "2",
    "name": "Enjoying the sunshine",
    "category": "SELFIE",
    "githubUser": "sSchmidt",
    "created": "1-2-1985"
  },
  {
    "id": "3",
    "name": "Gunbarrel 25",
    "desctiprion": "25 laps on gunbarrel today",
    "category": "LANDSCAPE",
    "githubUser": "sSchmidt",
    "created": "2018-04-15T19:09:57.308Z"
  }
];
let tags = [
  {
    "photoID": "1",
    "userID": "gPlake"
  },
  {
    "photoID": "2",
    "userID": "sSchmidt"
  },
  {
    "photoID": "2",
    "userID": "mHattrup"
  },
  {
    "photoID": "2",
    "userID": "gPlake"
  }
]

const typeDefs = readFileSync(`./schema.graphql`, `UTF-8`);
const resolvers = require(`resolvers`);

// expressアプリを作成する
let app = express();

// サーバーのインスタンスを作成
// その際、typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

app.get(`/`, (req, res) => res.end(`Welcome to the PhotoShare API`));
app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));

app.listen({ port: 4000 }, () =>
  console.log(`GraphQL Server running @ http://localhost:4000${ server.graphqlPath }`));
