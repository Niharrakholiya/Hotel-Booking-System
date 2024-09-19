const axios = require('axios');
require('dotenv').config();

async function getOlaAccessToken() {
  try {
    const response = await axios.post('https://account.olamaps.io/realms/olamaps/protocol/openid-connect/token', {
      grant_type: 'client_credentials',
      client_id: process.env.OLA_CLIENT_ID,
      client_secret: process.env.OLA_CLIENT_SECRET,
    }, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    return response.data.access_token;
  } catch (error) {
    console.error('Error getting Ola access token:', error.response?.data || error.message);
    throw new Error('Failed to get Ola access token');
  }
}

module.exports = { getOlaAccessToken };
