const express = require('express');
const axios = require('axios');
const router = express.Router();
const { getOlaAccessToken } = require('../utils/olaOauth');

const authMiddleware = async (req, res, next) => {
  try {
    const token = await getOlaAccessToken();
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ status: 'error', code: 401, message: 'Authentication failed' });
  }
};

router.use(authMiddleware);

router.get('/map', async (req, res) => {
  try {
    const response = await axios.get('https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json', {
      headers: {
        'Authorization': `Bearer ${req.token}`,
      },
      params: req.query, // Pass through any query parameters
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching map data from Ola API:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      status: 'error',
      code: error.response?.status || 500,
      message: error.response?.data?.message || 'Failed to fetch map data from Ola API'
    });
  }
});

module.exports = router;
