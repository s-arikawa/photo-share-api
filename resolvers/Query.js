module.exports = {
  // 写真をの数を返す
  totalPhotos: (parent, args, { db }) =>
    db.collection(`photos`).estimatedDocumentCount(),

  // すべての写真を返す
  allPhotos: async (parent, args, { db }) => {
    const photos = await db.collection(`photos`).find().toArray();
    console.log("allPhotos", photos);
    if (args.after) {
      return photos.filter(p => p.created >= args.after);
    } else {
      return photos;
    }
  },

  // ユーザーの数を返す
  totalUsers: (parent, args, { db }) =>
    db.collection("users").estimatedDocumentCount(),

  // すべてのユーザーを返す
  allUsers: (parent, args, { db }) =>
    db.collection(`users`).find().toArray()

};