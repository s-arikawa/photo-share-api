const fetch = require('node-fetch');

/*
 * Github APIにGithubトークンを要求する関数。
 * @param [Hash] credentials
 * @option [String] client_id
 * @option [String] client_secret
 * @option [String] code
 * @return [Promise[Hash]] Github アクセストークン
 * success:
 * {
 *   access_token: '12a68bd3c07c1d027292ed46a755ed8bf5718cb6',
 *   token_type: 'bearer',
 *   scope: 'user'
 * }
 * failed:
 * {
 *   error: 'bad_verification_code',
 *   error_description: 'The code passed is incorrect or expired.',
 *   error_uri: 'https://developer.github.com
 * }
 */
const requestGithubToken = credentials =>
  fetch(`https://github.com/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': `application/json`,
      'Accept': `application/json`
    },
    body: JSON.stringify(credentials)
  })
    .then(res => res.json());

/*
 * Github APIにアカウント情報を要求する関数。
 * @see REST API v3 : Get the authenticated user
 * https://developer.github.com/v3/users/#get-the-authenticated-user
 * @param [String] token Github Auth トークン
 * @return [Promise] Github アカウント情報
 */
const requestGithubUserAccount = token =>
  fetch(`https://api.github.com/user?access_token=${ token }`)
    .then(res => res.json());

/*
 * Github アカウント情報を返す関数.
 * @param [Hash] credentials
 * @option [String] client_id
 * @option [String] client_secret
 * @option [String] code
 * @return [Promise] Github アカウント情報
 */
async function authorizeWithGithub(credentials) {
  // Troubleshooting OAuth App access token request errors
  // https://developer.github.com/apps/managing-oauth-apps/troubleshooting-oauth-app-access-token-request-errors/
  const {
    access_token,
    error,
    error_description,
    error_uri
  } = await requestGithubToken(credentials);

  if (error) {
    console.error("Request Github Token: Error", { error, error_description, error_uri });
    return { message: error }
  }

  const githubUser = await requestGithubUserAccount(access_token);
  return { ...githubUser, access_token };
}

module.exports = { authorizeWithGithub };
