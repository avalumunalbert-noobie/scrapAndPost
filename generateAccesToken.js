const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <form action="/generate-token" method="post">
      <label for="app_id">App ID:</label>
      <input type="text" id="app_id" name="app_id" required><br>

      <label for="app_secret">App Secret:</label>
      <input type="password" id="app_secret" name="app_secret" required><br>

      <label for="page_id">Page ID:</label>
      <input type="text" id="page_id" name="page_id" required><br>

      <input type="submit" value="Generate Access Token">
    </form>
  `);
});

app.post('/generate-token', async (req, res) => {
  const { app_id, app_secret, page_id } = req.body;

  try {
    const appAccessTokenResponse = await axios.get(`https://graph.facebook.com/v13.0/oauth/access_token`, {
      params: {
        client_id: app_id,
        client_secret: app_secret,
        grant_type: 'client_credentials',
      },
    });

    const appAccessToken = appAccessTokenResponse.data.access_token;

    const pageAccessTokenResponse = await axios.get(`https://graph.facebook.com/v13.0/${page_id}`, {
      params: {
        fields: 'access_token',
        access_token: appAccessToken,
      },
    });

    const pageAccessToken = pageAccessTokenResponse.data.access_token;

    res.send(`Page Access Token: ${pageAccessToken}`);
  } catch (error) {
    console.error('Error generating page access token:', error.response.data.error);
    res.send('Error generating page access token. Please check your input and try again.');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
