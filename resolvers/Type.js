const { GraphQLScalarType } = require(`graphql`);

module.exports = {
  Photo: {
    // mongodbのdocument._idをidで返すため
    id: parent => parent._id,
    url: parent => `http://yoursite.com/img/${ parent._id }.jpg`,
    postedBy: async (parent, args, { db }) => {
      return db.collection(`users`).find({ "githubLogin": parent.githubUser }).toArray();
    },
    taggedUsers: async (parent, args, { db }) => {
      const tags = await db.collection(`tags`).find({ "photoID": parent.id }).toArray();
      console.debug("taggedUsers:", tags);
      return tags
        .map(tag => tag.userID)
        .map(async (userID) => {
          return db.collection(`users`).find({ "githubLogin": userID }).toArray();
        });
    }
  },

  User: {
    postedPhotos: async (parent, args, { db }) => {
      return db.collection(`photos`).find({ "githubUser": parent.githubLogin }).toArray();
    },
    inPhotos: async (parent, args, { db }) => {
      const tags = await db.collection(`tags`).find({ "userID": parent.id }).toArray();
      return tags
        .map(tag => tag.photoID)
        .map(async (photoID) => {
          return db.collection(`photos`).find({ "id": photoID }).toArray();
        });
    }
  },

  DateTime: new GraphQLScalarType({
    name: `DateTime`,
    description: `A valid date time value`,
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};