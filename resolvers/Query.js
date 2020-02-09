module.exports = {
  // 写真を格納した配列の長さを返す
  totalPhotos: () => photos.length,
  // すべての写真を返す
  allPhotos: (parent, args) => {
    if (args.after) {
      return photos.filter(p => p.created >= args.after);
    } else {
      return photos;
    }
  }
};