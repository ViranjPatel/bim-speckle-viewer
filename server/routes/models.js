const express = require('express');
const fs = require('fs-extra');
const path = require('path');

const router = express.Router();

// Get all uploaded models
router.get('/', async (req, res) => {
  try {
    const metadataDir = path.join(__dirname, '../../uploads/metadata');
    
    if (!await fs.pathExists(metadataDir)) {
      return res.json({ models: [] });
    }
    
    const files = await fs.readdir(metadataDir);
    const models = [];
    
    for (const file of files) {
      if (path.extname(file) === '.json') {
        try {
          const metadata = await fs.readJson(path.join(metadataDir, file));
          const filePath = path.join(__dirname, '../../uploads/models', metadata.filename);
          if (await fs.pathExists(filePath)) {
            models.push(metadata);
          }
        } catch (error) {
          console.error(`Error reading metadata file ${file}:`, error.message);
        }
      }
    }
    
    models.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Delete model
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const metadataPath = path.join(__dirname, '../../uploads/metadata', `${id}.json`);
    
    if (!await fs.pathExists(metadataPath)) {
      return res.status(404).json({ error: 'Model not found' });
    }
    
    const metadata = await fs.readJson(metadataPath);
    const filePath = path.join(__dirname, '../../uploads/models', metadata.filename);
    
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath);
    }
    
    await fs.remove(metadataPath);
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    console.error('Error deleting model:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;