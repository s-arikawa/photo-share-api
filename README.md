# photo-share-api

初めてのGraphQL

Node.jsでGraphQL APIを作る。

## 開発の仕方

* MongoDBをlocalhostにインストールする
    * [Install MongoDB Community Edition on macOS](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/)
    * Homebrewを使う
        * `brew tap mongodb/brew`
        * `brew install mongodb-community@4.2`
        * `brew services start mongodb-community@4.2`
    * mongo コマンドで接続できる
        * `mongo`
    

* テスト用GraphQLサーバを起動する
    * `npm start`
    * `GraphQL Server running @ http://localhost:4000/graphql`

* Endpoints
    * / : hello
    * /graphql : GraphQL API (PlayGroundが開く)
    * /playground : GraphQL PlayGround が使える
    
## その他環境情報

* Github OAuth Apps 設定
    * Github OAuthを使った認可処理を実装しています。
    * 詳細は説明しませんが、Authorization callback URL に `http://localhost:3000` を設定しています。

* Github Auth 手動確認方法
    * ブラウザで `https://github.com/login/oauth/authorize?client_id=<YOUR-CLIENT-ID>&scope=user` を開く。
    * Githubのナビゲーションに従ってアプリケーションを認可する。
    * アプリケーションを認可すると、Githubはコードをパラメータに追加した上で、 `http://localhost:3000?code=XYZ` にリダイレクトします。
    * コードが XYZ だと仮定します。ブラウザのURLからコードをコピーして、githubAuthミューテーションを送信します。
    * ```
      mutation {
        githubAuth(code: 'XYZ') {
          token
          user {
            githubLogin
            name
            avatar
          }
        }
      }
      ```
    * Github認可コードは期限付きです。すぐ期限が切れるので、再度最初の手順を行って、コードを取り直します。

### MongoDBのデータベース
* DB名:
    * photo-share
* Collection: (変わるかも)
    * photos
    * users
    * tags
    
> MongoDB スキーマレスなので初期設定無しでデータを登録開始できる

### 開発時もろもろバージョン
* Node.js
    * v12.15.0
* npm
    * 6.13.4
