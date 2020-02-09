// apollo-serverモジュールを読み込む
const {ApolloServer} = require(`apollo-server`);

const typeDefs = `
  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }
  
  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo]!
  }
  
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

let _id = 0;
// 写真を格納するための配列を定義する
let photos = [];

const resolvers = {
  Query: {
    // 写真を格納した配列の長さを返す
    totalPhotos: () => photos.length,
    // すべての写真を返す
    allPhotos: () => photos
  },

  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input
      };
      photos.push(newPhoto);
      return newPhoto;
    }
  },

  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`
  }
};

// サーバーのインスタンスを作成
// その際、typeDefs(スキーマ)とリゾルバを引数に取る
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Webサーバーを起動
server
  .listen()
  .then(({url}) => console.log(`GraphQL Service running on ${url}`));
