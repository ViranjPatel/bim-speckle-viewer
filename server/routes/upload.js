const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');

const router = express.Router();

// Supported BIM file formats
const SUPPORTED_FORMATS = {
  '.ifc': 'model/ifc',
  '.obj': 'model/obj',
  '.fbx': 'model/fbx',
  '.dae': 'model/dae',
  '.3dm': 'model/3dm',
  '.rvt': 'application/revit',
  '.dwg': 'application/dwg',
  '.dxf': 'application/dxf',
  '.step': 'model/step',
  '.stp': 'model/step',
  '.iges': 'model/iges',
  '.igs': 'model/iges',
  '.gltf': 'model/gltf+json',
  '.glb': 'model/gltf-binary'
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/models');
    fs.ensureDirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext);
    const sanitizedBaseName = baseName.replace(/[^a-zA-Z0-9-_]/g, '_');
    cb(null, `${uniqueId}_${sanitizedBaseName}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (SUPPORTED_FORMATS[ext]) {
    cb(null, true);
  } else {
    cb(new Error(`Unsupported file format: ${ext}. Supported formats: ${Object.keys(SUPPORTED_FORMATS).join(', ')}`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
    files: 5 // Maximum 5 files at once
  }
});

// Upload single model file
router.post('/model', upload.single('model'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileInfo = {
      id: path.basename(req.file.filename, path.extname(req.file.filename)).split('_')[0],
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimetype: req.file.mimetype,
      size: req.file.size,
      format: path.extname(req.file.originalname).toLowerCase(),
      uploadDate: new Date().toISOString(),
      path: req.file.path,
      url: `/uploads/models/${req.file.filename}`
    };

    // Save file metadata
    const metadataPath = path.join(__dirname, '../../uploads/metadata', `${fileInfo.id}.json`);
    await fs.ensureDir(path.dirname(metadataPath));
    await fs.writeJson(metadataPath, fileInfo, { spaces: 2 });

    res.json({
      message: 'File uploaded successfully',
      file: fileInfo
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get supported formats
router.get('/formats', (req, res) => {
  res.json({
    supportedFormats: SUPPORTED_FORMATS,
    extensions: Object.keys(SUPPORTED_FORMATS)
  });
});

module.exports = router;