// apollo-serverモジュールを読み込む
const { ApolloServer } = require(`apollo-server-express`);
const express = require(`express`);
const expressPlayground = require(`graphql-playground-middleware-express`).default;
const { readFileSync } = require(`fs`);

const { MongoClient } = require(`mongodb`);
require(`dotenv`).config();

const typeDefs = readFileSync(`./schema.graphql`, `UTF-8`);
const resolvers = require(`./resolvers`);

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOME;

  const client = await MongoClient.connect(
    MONGO_DB,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  );

  const db = client.db();

  const context = { db };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      // Request header "authorization" から Githubアクセストークンを取得
      const githubToken = req.headers.authorization;
      // MongoDBに保存されているユーザーを取得 (未登録のユーザーの場合は nullを返す)
      // currentUser コンテキストに追加する
      const currentUser = await db.collection('users').findOne({ githubToken });
      // db : MongoClient
      // currentUser : リクエストしているユーザー
      return { db, currentUser };
    }
  });

  server.applyMiddleware({ app });

  app.get(`/`, (req, res) => res.end(`Welcome to the PhotoShare API`));
  app.get(`/playground`, expressPlayground({ endpoint: `/graphql` }));

  app.listen({ port: 4000 }, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${ server.graphqlPath }`));

}

start();