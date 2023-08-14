const axios = require('axios');

const userAccessToken = 'EAAQWcLv3alQBOzJeE8yhAZCs6ifr80nHJd9UKtMGzWckSavZCg77jo4LdeCJd0pLTx5vKXFZBvkmC3pfIrcjJrOSF1AQACx5mu2IgZCnWKNX7hlpqQ7vuKBhevtI9SZBXFe6uuLu2JWquX24Xz5vciuaSuHXC6lO1dmHSIdGU1Lp9Vk9PCMZB6taM2bpleGcOGjZBBGZBgAXZAAlEmjMd9oCgSeGajVEZB8vn3O2pCE9G0AlkZD';
const pageId = '419025421864993'; // Replace this with the actual ID of the Facebook page you want to post to.

async function postToFacebookPage() {
  try {
    // Get the page access token
    const response = await axios.get(
      `https://graph.facebook.com/me/accounts`,
      {
        params: {
          access_token: userAccessToken,
        },
      }
    );

    // Find the page access token for the desired page
    const page = response.data.data.find((item) => item.id === pageId);
    if (!page) {
      console.error('User does not manage the specified page.');
      return;
    }

    const pageAccessToken = page.access_token;
    console.log(pageAccessToken);

    // Post to the page
    const postResponse = await axios.post(
      `https://graph.facebook.com/${pageId}/feed`,
      {
        message: 'Hello, this is a test post!',
      },
      {
        params: {
          access_token: pageAccessToken,
        },
      }
    );

    console.log('Post ID:', postResponse.data.id);
  } catch (error) {
    console.error('Error posting to Facebook:', error.response.data.error);
  }
}

postToFacebookPage();
