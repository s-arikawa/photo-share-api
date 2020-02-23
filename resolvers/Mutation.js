const fetch = require('node-fetch');
const { authorizeWithGithub } = require('../lib');

module.exports = {
  async postPhoto(parent, args, { db, currentUser }) {
    // 1. コンテキストにユーザーがいなければエラーを投げる
    if (!currentUser) {
      throw new Error(`only an authorized user can post a photo`);
    }
    // 2. 現在のユーザーのIDとphotoを保存する
    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    };
    console.debug("post Photo :", newPhoto);
    const { insertedId } = await db.collection(`photos`).insertOne(newPhoto);
    console.debug("inserted", insertedId);
    newPhoto.id = insertedId;
    return newPhoto;
  },

  /*
   * Github OAuth 認可コードを受け取って、GithubユーザーをMongoDBに登録・更新する Mutation.
   * @param [String] code Github認可コード
   * @return [User] + token UserオブジェクトとGithub access token
   */
  async githubAuth(parent, { code }, { db }) {
    // 1. Githubからデータを取得する
    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    });

    // 2. メッセージがある場合は何らかのエラーが発生している
    if (message) {
      throw new Error(message);
    }

    // 3. データをひとつのオブジェクトにまとめる
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };

    // 4. 新しい情報をもとにレコードを追加したり更新する
    const { ops: [ user ] } = await db.collection('users')
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    // 5. ユーザーデータとトークンを返す
    return { user, token: access_token }
  },

  /*
   * フェイクユーザーを生成するミューテーション。
   * https://randomuser.me/apiを使用する
   * @param count 指定した数だけフェイクユーザーを作成する
   * @return [User] 作成したユーザー
   */
  addFakeUsers: async (root, { count }, { db }) => {
    const randomUserApi = `https://randomuser.me/api/?results=${ count }`;
    let { results } = await fetch(randomUserApi).then(res => res.json());
    let users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${ r.name.first } ${ r.name.last }`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }));
    await db.collection('users').insertMany(users);
    return users;
  },

  /*
   * フェイクユーザーのGithub Access Tokenを調べるミューテーション
   * @param [String] githubLogin Github User ID
   * @return [User] + Github Access Token
   */
  fakeUserAuth: async (parent, { githubLogin }, { db }) => {
    const user = await db.collection('users').findOne({ githubLogin });
    if(!user) {
      throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
    }
    return {
      token: user.githubToken,
      user
    }
  }
};