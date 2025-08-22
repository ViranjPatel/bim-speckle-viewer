const express = require('express');
const axios = require('axios');
const router = express.Router();

const SPECKLE_SERVER_URL = process.env.SPECKLE_SERVER_URL || 'https://speckle.xyz';

// Proxy Speckle API requests to handle CORS
router.get('/streams/:streamId', async (req, res) => {
  try {
    const { streamId } = req.params;
    const response = await axios.get(`${SPECKLE_SERVER_URL}/api/streams/${streamId}`, {
      headers: {
        'Authorization': req.headers.authorization || ''
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Speckle API error:', error.message);
    res.status(error.response?.status || 500).json({ 
      error: error.response?.data?.message || error.message 
    });
  }
});

// Validate Speckle URL and extract components
router.post('/validate-url', (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Parse Speckle URL patterns
    const urlRegex = /^https?:\/\/([^/]+)\/streams\/([a-f0-9]+)(?:\/(commits|objects)\/([a-f0-9]+))?/i;
    const match = url.match(urlRegex);
    
    if (!match) {
      return res.status(400).json({ error: 'Invalid Speckle URL format' });
    }
    
    const [, serverUrl, streamId, type, id] = match;
    
    res.json({
      valid: true,
      serverUrl: `https://${serverUrl}`,
      streamId,
      type: type || 'stream',
      id: id || null,
      viewerUrl: type && id 
        ? `https://${serverUrl}/streams/${streamId}/${type}/${id}`
        : `https://${serverUrl}/streams/${streamId}`
    });
  } catch (error) {
    console.error('URL validation error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;