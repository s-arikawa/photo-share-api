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
