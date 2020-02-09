module.exports = {
  // 写真を格納した配列の長さを返す
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
  }
};