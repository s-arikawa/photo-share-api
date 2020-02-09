module.exports = {
  async postPhoto(parent, args, { db }) {
    const newPhoto = {
      ...args.input,
      created: new Date()
    };
    console.debug("post Photo :", newPhoto);
    const { insertedId } = await db.collection(`photos`).insertOne(newPhoto);
    console.debug("inserted", insertedId);
    newPhoto.id = insertedId[0];
    return newPhoto;
  }
};